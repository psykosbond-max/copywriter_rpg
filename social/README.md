# Automatic posting to Instagram, TikTok and LinkedIn

The lesson videos post themselves, with captions, on the schedule in `posts.json`.

- **Videos** live in `media/lessons/`. The site serves them at `<your site>/media/lessons/<file>.mp4`, and Instagram fetches them from there.
- **Captions and times** live in `posts.json`, one caption per platform per lesson (LinkedIn also gets a video title). Edit them freely. Times are in UTC, which matches UK time from late October to late March.
- **The job** is `.github/workflows/social-post.yml`. It runs every hour, posts anything due, and records the result (`posted`, `in_drafts` or `failed`, with the reason) back in `posts.json`.
- **The script** is `post.py`. It uses only the official APIs: the Instagram Graph API for Reels, the TikTok Content Posting API, and LinkedIn's Videos and Posts APIs.

Nothing posts until you add the secrets below. Until then every run just reports what it would do.

## How each platform behaves

| | Instagram | TikTok | LinkedIn |
|---|---|---|---|
| What you need | A professional (Business or Creator) account and a Meta developer app | A TikTok developer app | A LinkedIn developer app linked to a LinkedIn Page |
| Caption | Set automatically | Set automatically only in **direct** mode | Set automatically |
| Before any review | Works for your own account | **inbox** mode: the video lands in your TikTok drafts, and you paste the caption and tap Post. **direct** mode: posts with the caption, but only as **private**. | Posts publicly to **your personal profile** |
| After review | (no review needed for your own account) | Once TikTok approves the app's audit, direct mode posts publicly with the caption | Posting as the **workexp company page** needs LinkedIn to approve the Community Management API |
| Sign-in | Refreshed automatically | Refreshed automatically | **Sign in again every 60 days** (one command, step 3) |

The job runs in **inbox** mode for TikTok by default. Each draft's caption is printed in the run summary, ready to copy. Switch to direct mode once the audit is approved (step 5.5).

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

### 3. LinkedIn (about 15 minutes, then 2 minutes every 60 days)

1. At [linkedin.com/developers](https://www.linkedin.com/developers/apps), create an app. LinkedIn asks for a company Page to attach it to; use the workexp Page (create one first if needed). The app is not shown on the Page.
2. On the app's **Products** tab, add **Sign In with LinkedIn using OpenID Connect** and **Share on LinkedIn**. Both are self-serve: no review.
3. On the **Auth** tab, add a redirect URL (for example `https://game.harshasatish.com/`) and copy the client ID and secret.
4. Sign in:

   ```
   LINKEDIN_CLIENT_ID=... LINKEDIN_CLIENT_SECRET=... python3 social/linkedin_auth.py https://game.harshasatish.com/
   ```

   Open the link, approve with the account you post from, and paste back the address LinkedIn sends you to. It prints the access token, your author ID and the expiry date.

**Every 60 days:** LinkedIn only gives refresh tokens to apps in its partner programmes, so the token can't renew itself. Run the same command again and update `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_TOKEN_EXPIRES`. The job warns in its run summary 10 days before the token expires. If it does lapse, LinkedIn posts that fall due simply wait, and go out on the first run after you renew.

**Posting as the company page instead.** Request the **Community Management API** on a *separate* LinkedIn app (LinkedIn requires it to be the only product on that app). It needs a verified Page and a short application describing the use. Once approved, sign in with `LINKEDIN_SCOPES="w_organization_social"` set, and set `LINKEDIN_AUTHOR` to `urn:li:organization:<page id>` (the number in the Page's admin URL). You must be an admin of the Page. Nothing else changes.

### 4. Add the secrets to GitHub

In the repo: **Settings → Secrets and variables → Actions**.

**Secrets**

| Name | Value |
|---|---|
| `IG_USER_ID` | From step 1.4 |
| `IG_ACCESS_TOKEN` | From step 1.3 |
| `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` | From your TikTok app |
| `TIKTOK_REFRESH_TOKEN` | From step 2.3 |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_AUTHOR` | From step 3.4 |
| `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REFRESH_TOKEN` | Only if step 3.4 printed a refresh token (partner-approved apps) |
| `GH_SECRETS_TOKEN` | **Required.** A fine-grained personal access token for this repo with *Secrets: read and write*. TikTok can hand out a new refresh token on every run, and Instagram tokens change when refreshed. The job uses this to save the new ones. Without it, posting stops working after the first run. |

**Variables**

| Name | Value |
|---|---|
| `SITE_BASE_URL` | The live address of this site, e.g. `https://game.harshasatish.com` (no trailing slash) |
| `TIKTOK_MODE` | `inbox` (default) or `direct` |
| `TIKTOK_PRIVACY` | For direct mode: `PUBLIC_TO_EVERYONE` (default), `MUTUAL_FOLLOW_FRIENDS` or `SELF_ONLY` |
| `LINKEDIN_TOKEN_EXPIRES` | The date from step 3.4, e.g. `2026-12-24`. Used for the renewal warning. |
| `LINKEDIN_VERSION` | Optional. LinkedIn API version as `YYYYMM` (default `202609`). LinkedIn retires each version about a year after release, so bump this if a run fails with a version error. |

### 5. Test, then let it run

1. The scheduled job only runs from the repo's default branch, so merge this change first.
2. **Actions → Post lessons to Instagram, TikTok and LinkedIn → Run workflow** with *Dry run* ticked. The summary lists what would be posted.
3. To post one lesson right now, untick *Dry run* and enter its id (e.g. `lesson-01-taglines`). The same box retries a lesson whose status is `failed`.
4. After that, the hourly run takes over and follows the times in `posts.json`.
5. When TikTok approves your audit, set the `TIKTOK_MODE` variable to `direct`.
6. A platform without secrets is skipped, so you can set them up one at a time.

## Limits worth knowing

- Instagram allows a limited number of API posts per account per day (Meta's docs currently say 100). This schedule posts one every two or three days.
- Reels must be 9:16 MP4 between 3 seconds and 15 minutes. The lessons are 54–64 seconds.
- Cloudflare serves files up to 25 MB, and the lesson videos are 15–22 MB. Keep new videos under that size.
- TikTok's audit has no published timeline.
- LinkedIn videos can be up to 500 MB and 3 seconds to 30 minutes; vertical video plays fine in the feed. LinkedIn post text is limited to 3,000 characters; the captions here are about 500. The job escapes characters LinkedIn treats as formatting and turns `#words` into real hashtags.
