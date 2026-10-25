#!/usr/bin/env python3
"""LinkedIn sign-in: prints the link to approve the app, then swaps the returned code for an access
token and looks up who you are. Run it once now, then again every 60 days (LinkedIn tokens expire).

    LINKEDIN_CLIENT_ID=... LINKEDIN_CLIENT_SECRET=... python3 social/linkedin_auth.py https://your-redirect-uri/

1. Open the printed link while signed in to the LinkedIn account you post from, and approve it.
2. LinkedIn sends you to the redirect URI with ?code=... in the address bar. Copy that whole address.
3. Paste it here. The script prints the values to save as secrets.
"""
import json, os, secrets, sys, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

cid, secret = os.environ["LINKEDIN_CLIENT_ID"], os.environ["LINKEDIN_CLIENT_SECRET"]
redirect = sys.argv[1] if len(sys.argv) > 1 else input("Redirect URI registered in your LinkedIn app: ").strip()
scopes = os.environ.get("LINKEDIN_SCOPES", "openid profile w_member_social")
url = "https://www.linkedin.com/oauth/v2/authorization?" + urllib.parse.urlencode({"response_type": "code", "client_id": cid, "redirect_uri": redirect, "scope": scopes, "state": secrets.token_urlsafe(12)})
print("\n1. Open this link and approve the app:\n\n" + url + "\n")
back = input("2. Paste the full address LinkedIn sent you to: ").strip()
code = urllib.parse.parse_qs(urllib.parse.urlparse(back).query).get("code", [back])[0]
data = urllib.parse.urlencode({"grant_type": "authorization_code", "code": code, "redirect_uri": redirect, "client_id": cid, "client_secret": secret}).encode()
req = urllib.request.Request("https://www.linkedin.com/oauth/v2/accessToken", data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
r = json.loads(urllib.request.urlopen(req).read())
if "access_token" not in r:
    sys.exit(f"LinkedIn did not return a token: {r}")
me = json.loads(urllib.request.urlopen(urllib.request.Request("https://api.linkedin.com/v2/userinfo", headers={"Authorization": f"Bearer {r['access_token']}"})).read())
expires = (datetime.now(timezone.utc) + timedelta(seconds=r.get("expires_in", 5184000))).date().isoformat()
print(f"\nSigned in as {me.get('name')} with scopes: {r.get('scope')}")
print("\nSecret LINKEDIN_ACCESS_TOKEN:\n\n" + r["access_token"] + "\n")
print(f"Secret LINKEDIN_AUTHOR (posts to your profile): urn:li:person:{me['sub']}")
print(f"Variable LINKEDIN_TOKEN_EXPIRES: {expires}")
if r.get("refresh_token"):
    print("\nLinkedIn also issued a refresh token, so the job can renew the access token itself.")
    print("Secret LINKEDIN_REFRESH_TOKEN (plus LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET):\n\n" + r["refresh_token"] + "\n")
