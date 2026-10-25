#!/usr/bin/env python3
"""Posts due lesson videos to Instagram (Reels), TikTok and LinkedIn, with captions.

Reads social/posts.json, posts every entry whose time has passed and whose platform status is
still "pending", and writes the result back into the file. Runs from the GitHub Actions workflow
in .github/workflows/social-post.yml, or by hand:

    python3 social/post.py --dry-run        # show what would be posted, change nothing
    python3 social/post.py                  # post for real (needs the secrets below)
    python3 social/post.py --only lesson-01-taglines --platform instagram

Environment (set as GitHub Actions secrets; see social/README.md):
    SITE_BASE_URL          public address of this site, e.g. https://game.harshasatish.com
    IG_USER_ID             Instagram professional account ID
    IG_ACCESS_TOKEN        long-lived Instagram token (refreshed on every run)
    IG_GRAPH_HOST          graph.instagram.com (Instagram Login, default) or graph.facebook.com
    TIKTOK_CLIENT_KEY      TikTok app client key
    TIKTOK_CLIENT_SECRET   TikTok app client secret
    TIKTOK_REFRESH_TOKEN   refresh token from social/tiktok_auth.py
    TIKTOK_MODE            "inbox" (default: lands in your TikTok drafts, works before the app
                           audit) or "direct" (publishes with the caption; private until audited)
    TIKTOK_PRIVACY         privacy for direct mode, default PUBLIC_TO_EVERYONE
    LINKEDIN_ACCESS_TOKEN  member token from social/linkedin_auth.py (lasts 60 days)
    LINKEDIN_AUTHOR        urn:li:person:... for your profile, or urn:li:organization:... for a page
    LINKEDIN_TOKEN_EXPIRES date the token expires (printed by linkedin_auth.py); the job warns before it
    LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN
                           optional; only apps LinkedIn has approved get refresh tokens
    LINKEDIN_VERSION       API version as YYYYMM, default below
    GH_SECRETS_TOKEN       optional; lets the job save rotated tokens back into the repo secrets
"""
import argparse, json, os, re, subprocess, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "social" / "posts.json"
IG_VERSION = os.environ.get("IG_API_VERSION", "v23.0")
TT = "https://open.tiktokapis.com"
LI = "https://api.linkedin.com/rest"
LI_VERSION = os.environ.get("LINKEDIN_VERSION") or "202609"  # LinkedIn retires each version after about a year
SUMMARY = []


def log(msg):
    print(msg, flush=True)
    SUMMARY.append(msg)


def http(method, url, data=None, headers=None, body=None, timeout=120, with_headers=False):
    """Small JSON-over-HTTP helper. `data` is form-encoded, `body` is sent as JSON or raw bytes.
    With `with_headers`, returns (json, response headers)."""
    headers = dict(headers or {})
    payload = None
    if data is not None:
        payload = urllib.parse.urlencode(data).encode()
        headers.setdefault("Content-Type", "application/x-www-form-urlencoded")
    elif isinstance(body, (bytes, bytearray)):
        payload = bytes(body)
    elif body is not None:
        payload = json.dumps(body).encode()
        headers.setdefault("Content-Type", "application/json; charset=UTF-8")
    req = urllib.request.Request(url, data=payload, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw, got = r.read(), r.headers
    except urllib.error.HTTPError as e:
        raw = e.read()
        raise RuntimeError(f"{method} {url.split('?')[0]} -> HTTP {e.code}: {raw[:500].decode(errors='replace')}")
    out = json.loads(raw) if raw.strip() else {}
    return (out, got) if with_headers else out


def save_secret(name, value):
    """Store a rotated token back into the repo's Actions secrets, if a token for that is provided."""
    if not os.environ.get("GH_SECRETS_TOKEN") or not os.environ.get("GITHUB_REPOSITORY"):
        log(f"  note: {name} changed but GH_SECRETS_TOKEN is not set, so it was not saved. Update the secret by hand.")
        return
    env = {**os.environ, "GH_TOKEN": os.environ["GH_SECRETS_TOKEN"]}
    subprocess.run(["gh", "secret", "set", name, "--repo", os.environ["GITHUB_REPOSITORY"], "--body", value], env=env, check=True, capture_output=True)
    log(f"  saved the refreshed {name}")


# ---------------------------------------------------------------- Instagram
class Instagram:
    def __init__(self):
        self.user = os.environ["IG_USER_ID"]
        self.token = os.environ["IG_ACCESS_TOKEN"]
        self.host = os.environ.get("IG_GRAPH_HOST", "graph.instagram.com")
        self.base = f"https://{self.host}/{IG_VERSION}"

    def refresh(self):
        # Long-lived Instagram Login tokens last 60 days; refreshing on each run keeps them alive.
        if self.host != "graph.instagram.com":
            return
        try:
            r = http("GET", "https://graph.instagram.com/refresh_access_token?" + urllib.parse.urlencode({"grant_type": "ig_refresh_token", "access_token": self.token}))
            if r.get("access_token") and r["access_token"] != self.token:
                self.token = r["access_token"]
                save_secret("IG_ACCESS_TOKEN", self.token)
        except RuntimeError as e:
            log(f"  note: Instagram token refresh skipped ({e})")

    def post(self, video_url, caption):
        c = http("POST", f"{self.base}/{self.user}/media", data={"media_type": "REELS", "video_url": video_url, "caption": caption, "share_to_feed": "true", "access_token": self.token})
        cid = c["id"]
        for _ in range(60):  # up to ~10 minutes of processing
            s = http("GET", f"{self.base}/{cid}?" + urllib.parse.urlencode({"fields": "status_code,status", "access_token": self.token}))
            code = s.get("status_code")
            if code == "FINISHED":
                break
            if code in ("ERROR", "EXPIRED"):
                raise RuntimeError(f"Instagram could not process the video: {s.get('status')}")
            time.sleep(10)
        else:
            raise RuntimeError("Instagram was still processing the video after 10 minutes")
        p = http("POST", f"{self.base}/{self.user}/media_publish", data={"creation_id": cid, "access_token": self.token})
        return p["id"]


# ---------------------------------------------------------------- TikTok
class TikTok:
    def __init__(self):
        self.mode = os.environ.get("TIKTOK_MODE", "inbox")
        self.privacy = os.environ.get("TIKTOK_PRIVACY", "PUBLIC_TO_EVERYONE")
        r = http("POST", f"{TT}/v2/oauth/token/", data={"client_key": os.environ["TIKTOK_CLIENT_KEY"], "client_secret": os.environ["TIKTOK_CLIENT_SECRET"], "grant_type": "refresh_token", "refresh_token": os.environ["TIKTOK_REFRESH_TOKEN"]})
        if "access_token" not in r:
            raise RuntimeError(f"TikTok token refresh failed: {r}")
        self.token = r["access_token"]
        if r.get("refresh_token") and r["refresh_token"] != os.environ["TIKTOK_REFRESH_TOKEN"]:
            save_secret("TIKTOK_REFRESH_TOKEN", r["refresh_token"])

    def api(self, path, body):
        r = http("POST", f"{TT}{path}", headers={"Authorization": f"Bearer {self.token}"}, body=body)
        err = (r.get("error") or {}).get("code", "ok")
        if err != "ok":
            raise RuntimeError(f"TikTok {path}: {r['error'].get('code')} {r['error'].get('message', '')}")
        return r.get("data", {})

    def post(self, path, caption):
        size = path.stat().st_size
        # Files up to 64 MB can go up in one chunk; the lesson videos are about 20 MB.
        source = {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": size, "total_chunk_count": 1}
        if self.mode == "direct":
            info = self.api("/v2/post/publish/creator_info/query/", {})
            privacy = self.privacy if self.privacy in info.get("privacy_level_options", []) else "SELF_ONLY"
            if privacy != self.privacy:
                log(f"  note: TikTok only allows {info.get('privacy_level_options')} for this app, so the post is {privacy}")
            d = self.api("/v2/post/publish/video/init/", {"post_info": {"title": caption, "privacy_level": privacy, "disable_comment": False, "disable_duet": False, "disable_stitch": False, "video_cover_timestamp_ms": 1500}, "source_info": source})
        else:
            d = self.api("/v2/post/publish/inbox/video/init/", {"source_info": source})
        http("PUT", d["upload_url"], body=path.read_bytes(), headers={"Content-Type": "video/mp4", "Content-Length": str(size), "Content-Range": f"bytes 0-{size - 1}/{size}"}, timeout=600)
        for _ in range(60):
            s = self.api("/v2/post/publish/status/fetch/", {"publish_id": d["publish_id"]})
            st = s.get("status")
            if st in ("PUBLISH_COMPLETE", "SEND_TO_USER_INBOX"):
                return d["publish_id"], st
            if st == "FAILED":
                raise RuntimeError(f"TikTok failed the upload: {s.get('fail_reason')}")
            time.sleep(10)
        raise RuntimeError("TikTok was still processing the video after 10 minutes")


# ---------------------------------------------------------------- LinkedIn
def little_text(caption):
    """LinkedIn post text treats these characters as markup, so escape them; #words become hashtags."""
    parts = re.split(r"(?<!\w)#(\w+)", caption)  # odd items are hashtag words
    return "".join("{hashtag|\\#|" + s + "}" if i % 2 else re.sub(r"([\\|{}@\[\]()<>*_~#])", r"\\\1", s) for i, s in enumerate(parts))


def linkedin_days_left():
    """Days until the LinkedIn token expires, or None if unknown or it renews itself."""
    expires = os.environ.get("LINKEDIN_TOKEN_EXPIRES")
    if not expires or os.environ.get("LINKEDIN_REFRESH_TOKEN"):
        return None
    return (datetime.fromisoformat(expires).date() - datetime.now(timezone.utc).date()).days


class LinkedIn:
    def __init__(self):
        self.author = os.environ["LINKEDIN_AUTHOR"]
        self.token = os.environ["LINKEDIN_ACCESS_TOKEN"]
        # Only partner-approved apps get refresh tokens; everyone else signs in again every 60 days.
        if all(os.environ.get(v) for v in ("LINKEDIN_REFRESH_TOKEN", "LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET")):
            r = http("POST", "https://www.linkedin.com/oauth/v2/accessToken", data={"grant_type": "refresh_token", "refresh_token": os.environ["LINKEDIN_REFRESH_TOKEN"], "client_id": os.environ["LINKEDIN_CLIENT_ID"], "client_secret": os.environ["LINKEDIN_CLIENT_SECRET"]})
            if r.get("access_token") and r["access_token"] != self.token:
                self.token = r["access_token"]
                save_secret("LINKEDIN_ACCESS_TOKEN", self.token)
        days = linkedin_days_left()
        if days is not None and days <= 10:
            log(f"  note: the LinkedIn token expires in {days} days. Run social/linkedin_auth.py and update the secrets.")

    def api(self, method, path, body=None, with_headers=False):
        h = {"Authorization": f"Bearer {self.token}", "LinkedIn-Version": LI_VERSION, "X-Restli-Protocol-Version": "2.0.0"}
        return http(method, f"{LI}{path}", headers=h, body=body, with_headers=with_headers)

    def post(self, path, caption, title):
        size = path.stat().st_size
        init = self.api("POST", "/videos?action=initializeUpload", {"initializeUploadRequest": {"owner": self.author, "fileSizeBytes": size, "uploadCaptions": False, "uploadThumbnail": False}})["value"]
        etags = []
        with path.open("rb") as f:  # LinkedIn hands back one upload URL per 4 MB part
            for part in init["uploadInstructions"]:
                f.seek(part["firstByte"])
                chunk = f.read(part["lastByte"] - part["firstByte"] + 1)
                _, h = http("PUT", part["uploadUrl"], body=chunk, headers={"Content-Type": "application/octet-stream"}, timeout=600, with_headers=True)
                etags.append(h["ETag"])
        video = init["video"]
        self.api("POST", "/videos?action=finalizeUpload", {"finalizeUploadRequest": {"video": video, "uploadToken": init.get("uploadToken", ""), "uploadedPartIds": etags}})
        for _ in range(60):
            st = self.api("GET", "/videos/" + urllib.parse.quote(video, safe="")).get("status")
            if st == "AVAILABLE":
                break
            if st == "PROCESSING_FAILED":
                raise RuntimeError("LinkedIn could not process the video")
            time.sleep(10)
        else:
            raise RuntimeError("LinkedIn was still processing the video after 10 minutes")
        _, h = self.api("POST", "/posts", {
            "author": self.author, "commentary": little_text(caption), "visibility": "PUBLIC",
            "distribution": {"feedDistribution": "MAIN_FEED", "targetEntities": [], "thirdPartyDistributionChannels": []},
            "content": {"media": {"title": title, "id": video}},
            "lifecycleState": "PUBLISHED", "isReshareDisabledByAuthor": False}, with_headers=True)
        return h.get("x-restli-id")


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", help="post id to handle, ignoring its scheduled time")
    ap.add_argument("--platform", choices=["instagram", "tiktok", "linkedin"])
    a = ap.parse_args()

    doc = json.loads(POSTS.read_text())
    now = datetime.now(timezone.utc)
    if a.only:
        due = [p for p in doc["posts"] if p["id"] == a.only]
    else:
        due = [p for p in doc["posts"] if datetime.fromisoformat(p["when"].replace("Z", "+00:00")) <= now]
    platforms = [a.platform] if a.platform else ["instagram", "tiktok", "linkedin"]
    retry = ("pending", "failed") if a.only else ("pending",)  # a named post can be retried after a failure
    work = [(p, k) for p in due for k in platforms if p.get(k, {}).get("status") in retry]
    if not work:
        log("Nothing is due.")
        return finish(doc, False)

    base = os.environ.get("SITE_BASE_URL", "").rstrip("/")
    have = {"instagram": all(os.environ.get(v) for v in ("IG_USER_ID", "IG_ACCESS_TOKEN")) and base,
            "tiktok": all(os.environ.get(v) for v in ("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN")),
            "linkedin": all(os.environ.get(v) for v in ("LINKEDIN_ACCESS_TOKEN", "LINKEDIN_AUTHOR"))}
    if have["linkedin"] and (linkedin_days_left() or 0) < 0:
        # Leave LinkedIn posts pending: they go out on the first run after you sign in again.
        log(f"LinkedIn token expired on {os.environ['LINKEDIN_TOKEN_EXPIRES']}. Run social/linkedin_auth.py and update the secrets.")
        have["linkedin"] = False
    clients, changed, failed = {}, False, False
    for p, k in work:
        video = ROOT / p["video"]
        caption = p[k]["caption"]
        log(f"{p['id']} → {k}")
        if a.dry_run or not have[k]:
            why = "dry run" if a.dry_run else "token expired" if k == "linkedin" and os.environ.get("LINKEDIN_ACCESS_TOKEN") else "secrets not set"
            log(f"  would post {p['video']} ({video.stat().st_size / 1e6:.1f} MB) with a {len(caption)}-character caption [{why}]")
            continue
        try:
            if k not in clients:
                clients[k] = {"instagram": Instagram, "tiktok": TikTok, "linkedin": LinkedIn}[k]()
                if k == "instagram":
                    clients[k].refresh()
            if k == "instagram":
                mid = clients[k].post(f"{base}/{p['video']}", caption)
                p[k].update(status="posted", media_id=mid)
                log(f"  posted to Instagram (media {mid})")
            elif k == "linkedin":
                urn = clients[k].post(video, caption, p[k].get("title", p["id"]))
                p[k].update(status="posted", post_urn=urn)
                log(f"  posted to LinkedIn ({urn})")
            else:
                pid, st = clients[k].post(video, caption)
                p[k].update(status="posted" if st == "PUBLISH_COMPLETE" else "in_drafts", publish_id=pid)
                if st == "SEND_TO_USER_INBOX":
                    log("  sent to your TikTok drafts. Open TikTok, add this caption and post:")
                    log("  " + caption)
                else:
                    log(f"  posted to TikTok (publish {pid})")
            p[k]["done_at"] = now.isoformat(timespec="seconds")
        except Exception as e:  # keep going with the other posts; record why this one failed
            p[k].update(status="failed", error=str(e)[:300])
            log(f"  FAILED: {e}")
            failed = True
        changed = True
    finish(doc, changed)
    if failed:
        sys.exit(1)


def finish(doc, changed):
    if changed:
        POSTS.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as f:
            f.write("### Social posting\n\n```\n" + "\n".join(SUMMARY) + "\n```\n")


if __name__ == "__main__":
    main()
