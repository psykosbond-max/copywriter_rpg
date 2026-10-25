# Automatic posting to Instagram and TikTok

The lesson videos post themselves, with captions, on the schedule in `posts.json`.

- **Videos** live in `media/lessons/`. The site serves them at `<your site>/media/lessons/<file>.mp4`, and Instagram fetches them from there.
- **Captions and times** live in `posts.json`, one Instagram caption and one TikTok caption per lesson. Edit them freely. Times are in UTC, which matches UK time from late October to late March.
- **The job** is `.github/workflows/social-post.yml`. It runs every hour, posts anything due, and records the result (`posted`, `in_drafts` or `failed`, with the reason) back in `posts.json`.
- **The script** is `post.py`. It uses only the official APIs: the Instagram Graph API for Reels, and the TikTok Content Posting API.

Nothing posts until you add the secrets below. Until then every run just reports what it would do.

## How each platform behaves

| | Instagram | TikTok |
|---|---|---|
| What you need | A professional (Business or Creator) account and a Meta developer app | A TikTok developer app |
| Caption | Set automatically | Set automatically only in **direct** mode |
| Before any review | Works for your own account | **inbox** mode: the video lands in your TikTok drafts, and you paste the caption and tap Post. **direct** mode: posts with the caption, but only as **private**. |
| After review | (no review needed for your own account) | Once TikTok approves the app's audit, direct mode posts publicly with the caption |

The job runs in **inbox** mode for TikTok by default. Each draft's caption is printed in the run summary, ready to copy. Switch to direct mode once the audit is approved (step 4).

## Setup

### 1. Instagram (about 20 minutes)

1. In the Instagram app, switch the account to a **professional account** (Settings → Account type and tools).
2. Go to [developers.facebook.com](https://developers.facebook.com/), create an app (type **Business**), and add the **Instagram** product with **API setup with Instagram login**.
3. Under *Generate access tokens*, add your Instagram account (it must accept the tester invite in the Instagram app), then generate a token with the `instagram_business_basic` and `instagram_business_content_publish` permissions. This gives you a long-lived token that lasts 60 days. The job refreshes it each time it posts.
4. Find your account ID: open `https://graph.instagram.com/me?fields=user_id,username&access_token=YOUR_TOKEN` in a browser and copy `user_id`.

### 2. TikTok (about 20 minutes, plus the audit wait for public posts)

1. At [developers.tiktok.com](https://developers.tiktok.com/), create an app and add **Login Kit** and the **Content Posting API**. Turn on **Direct Post** if you want captions set automatically later.
2. Add a redirect URI (for example `https://game.harshasatish.com/`). It only has to be a page you can open.
3. Sign in once to get a refresh token:

   ```
   TIKTOK_CLIENT_KEY=... TIKTOK_CLIENT_SECRET=... python3 social/tiktok_auth.py https://game.harshasatish.com/
   ```

   Open the link it prints, approve the app with the account you post from, and paste back the address TikTok sends you to. It prints the refresh token.

### 3. Add the secrets to GitHub

In the repo: **Settings → Secrets and variables → Actions**.

**Secrets**

| Name | Value |
|---|---|
| `IG_USER_ID` | From step 1.4 |
| `IG_ACCESS_TOKEN` | From step 1.3 |
| `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` | From your TikTok app |
| `TIKTOK_REFRESH_TOKEN` | From step 2.3 |
| `GH_SECRETS_TOKEN` | **Required.** A fine-grained personal access token for this repo with *Secrets: read and write*. TikTok can hand out a new refresh token on every run, and Instagram tokens change when refreshed. The job uses this to save the new ones. Without it, posting stops working after the first run. |

**Variables**

| Name | Value |
|---|---|
| `SITE_BASE_URL` | The live address of this site, e.g. `https://game.harshasatish.com` (no trailing slash) |
| `TIKTOK_MODE` | `inbox` (default) or `direct` |
| `TIKTOK_PRIVACY` | For direct mode: `PUBLIC_TO_EVERYONE` (default), `MUTUAL_FOLLOW_FRIENDS` or `SELF_ONLY` |

### 4. Test, then let it run

1. The scheduled job only runs from the repo's default branch, so merge this change first.
2. **Actions → Post lessons to Instagram and TikTok → Run workflow** with *Dry run* ticked. The summary lists what would be posted.
3. To post one lesson right now, untick *Dry run* and enter its id (e.g. `lesson-01-taglines`). The same box retries a lesson whose status is `failed`.
4. After that, the hourly run takes over and follows the times in `posts.json`.
5. When TikTok approves your audit, set the `TIKTOK_MODE` variable to `direct`.

## Limits worth knowing

- Instagram allows a limited number of API posts per account per day (Meta's docs currently say 100). This schedule posts one every two or three days.
- Reels must be 9:16 MP4 between 3 seconds and 15 minutes. The lessons are 54–64 seconds.
- Cloudflare serves files up to 25 MB, and the lesson videos are 15–22 MB. Keep new videos under that size.
- TikTok's audit has no published timeline.
