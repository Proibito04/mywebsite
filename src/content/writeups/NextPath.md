---
name: NextPath
starting_date: 2026-04-25
modified: 2026-04-25T15:23:06+03:00
private: false
tags:
  - web
machine_link: https://app.hackthebox.com/challenges/NextPath
difficulty: medium
created: 2026-04-25T15:11:59+03:00
type: CTF
---
## Flag location
The flag is located to the root of the machine`/flag.txt` so we have to perform a reading in the root
## The API
In this service we have just one api and it's in `app/pages/api/team.js` . This API accepts the parameter `id`.

There are couple of protections of path traversal, each one is bypassable. let's start 
### Regex bypass

We have to bypass this regex
```js
const ID_REGEX = /^[0-9]+$/m;
```
Let's breakdown this regex:

- `^` matches the start of the line **OR** the start of any new lines
- `$` matches the end of the line **OR** the end of the line

So even if we have `/m` (multilne) we just need **1** one valid line to bypass this regex.

---
### includes Bypass

Next.js parse parms with the same name (e.g. `?id=!&id=2`) in array (`id: ["1", "2"]`). In this case we can use this beavhior for bypass the `include`.

---
### Length Alignment (The 100 character slice)
The server executes `fs.readFileSync(filepath.slice(0, 100))`. The `filepath` is constructed as `path.join("team", query.id + ".png")`.
When `id` is an array `[payload, ""]`, `query.id + ".png"` becomes `payload + ",.png"`.
Our goal is to make the normalized path to `/flag.txt` exactly **100 characters long**, so that the trailing `,.png` is sliced off by the `slice(0, 100)` call.

#### Why `proc/thread-self/root/`?
- **The Modulo 3 Problem**: Standard traversal `../` is 3 characters. `proc/self/root/` is 15 characters. Both are multiples of 3. If the starting offset of our normalized path requires a specific alignment to hit exactly 100, we might be stuck if we only use components that are multiples of 3.
- **The Solution**: `proc/thread-self/root/` is **22 characters** long. Since `22 % 3 = 1`, it allows us to shift the total path length's remainder when divided by 3, enabling us to align our filename perfectly with the 100-character boundary.

### Exploit Script (`exploit.py`)

```python
from requests import request
import requests

TARGET_IP = "YOUR_IP"
TARGET_URL = f"http://{TARGET_IP}/api/team"

def set_url():
  travertal = "../"
  proc_root = "proc/thread-self/root/"
  flag = "flag.txt"
  
  url = f"{travertal*19}{proc_root*2}{flag}"
  len_string = len(url)-9
  print(len_string) # how i get len of 100?

  return url
  

if __name__ == "__main__":
  flag = requests.get(f"{TARGET_URL}?id=1%0A{set_url()}&id=")
  print(flag.text)
```

---

## Linux /proc Tricks

### /proc/self vs /proc/thread-self
- **`/proc/self`**: A symbolic link to the `/proc` directory of the process currently accessing it.
- **`/proc/thread-self`**: A symbolic link to the directory of the *thread* currently accessing it (specifically `/proc/self/task/<tid>`).

### The `root` symlink
Inside these directories, the `root` symlink points to the root directory of the filesystem. Using `proc/self/root/` or `proc/thread-self/root/` in a path traversal allows you to "reset" to the root directory. This is particularly useful for:
1. **Bypassing path normalization**: It allows you to continue a path from the root even if you've already traversed "up" past it.
2. **Padding length**: As seen in this exploit, it provides a longer path component (22 chars) that isn't a multiple of 3, helping to hit specific character limits like the 100-char slice.