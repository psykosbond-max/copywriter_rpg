#!/usr/bin/env python3
"""One-time TikTok sign-in: prints the link to approve the app, then swaps the returned code for a
refresh token to store as the TIKTOK_REFRESH_TOKEN secret.

    TIKTOK_CLIENT_KEY=... TIKTOK_CLIENT_SECRET=... python3 social/tiktok_auth.py https://your-redirect-uri/

1. Open the printed link while signed in to the TikTok account you post from, and approve it.
2. TikTok sends you to the redirect URI with ?code=... in the address bar. Copy that whole address.
3. Paste it here. The script prints the refresh token.
"""
import json, os, secrets, sys, urllib.parse, urllib.request

key, secret = os.environ["TIKTOK_CLIENT_KEY"], os.environ["TIKTOK_CLIENT_SECRET"]
redirect = sys.argv[1] if len(sys.argv) > 1 else input("Redirect URI registered in your TikTok app: ").strip()
scopes = "user.info.basic,video.upload,video.publish"
url = "https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode({"client_key": key, "scope": scopes, "response_type": "code", "redirect_uri": redirect, "state": secrets.token_urlsafe(12)})
print("\n1. Open this link and approve the app:\n\n" + url + "\n")
back = input("2. Paste the full address TikTok sent you to: ").strip()
code = urllib.parse.parse_qs(urllib.parse.urlparse(back).query).get("code", [back])[0]
data = urllib.parse.urlencode({"client_key": key, "client_secret": secret, "code": code, "grant_type": "authorization_code", "redirect_uri": redirect}).encode()
req = urllib.request.Request("https://open.tiktokapis.com/v2/oauth/token/", data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
r = json.loads(urllib.request.urlopen(req).read())
if "refresh_token" not in r:
    sys.exit(f"TikTok did not return a token: {r}")
print(f"\nSigned in as open_id {r.get('open_id')} with scopes: {r.get('scope')}")
print("Save this as the TIKTOK_REFRESH_TOKEN secret:\n\n" + r["refresh_token"] + "\n")
