# USCIS Tracker Release Checklist

## 1. Render Backend Setup

Set these environment variables in Render for the backend service:

- `PORT=10000`
- `USCIS_MODE=mock` or `USCIS_MODE=live`
- `USCIS_CLIENT_ID=your_uscis_client_id_here`
- `USCIS_CLIENT_SECRET=your_uscis_client_secret_here`
- `USCIS_TOKEN_URL=https://api-int.uscis.gov/oauth/accesstoken`
- `USCIS_CASE_STATUS_URL=https://api-int.uscis.gov/case-status`
- `USCIS_TIMEOUT_MS=10000`
- `GROQ_API_KEY=your_real_groq_key_here`
- `GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions`
- `GROQ_MODEL=llama-3.3-70b-versatile`

Verify these backend routes after deploy:

- `GET /health`
- `POST /api/case-status`
- `POST /api/ai-support`

## 2. Frontend Production Config Checks

Before building:

- confirm `PRODUCTION_API_URL` in `config/api.ts` matches your real Render backend URL
- confirm `app.json` has:
  - `android.package = "com.yoges.uscistracker"`
  - `android.versionCode = 1`
  - `version = "1.0.0"`
  - `scheme = "uscistracker"`
- confirm `eas.json` has:
  - `preview` profile for APK testing
  - `production` profile for AAB Play Store upload

## 3. App Testing Checklist

Test these before building production:

- Home tab can check USCIS case status
- save case from Home
- My Cases tab shows saved cases
- refresh a single case in My Cases
- pull to refresh all cases in My Cases
- delete one case
- clear all cases
- Support tab can send a message and get Groq-backed AI reply
- invalid receipt number shows clean error
- backend-down state shows clean error
- language switching still works
- privacy/support content still opens if used elsewhere in app

## 4. Play Store Listing Items

Prepare these items:

- app title
- short description
- full description
- app icon
- feature graphic if desired
- screenshots from Home, My Cases, Support
- privacy policy URL
- support email
- support website if available

## 5. EAS Build Commands

Preview APK:

```powershell
cd C:\Users\yoges\uscis-tracker
eas build --platform android --profile preview
```

Production AAB:

```powershell
cd C:\Users\yoges\uscis-tracker
eas build --platform android --profile production
```

## 6. Git + Deploy Flow

Push code:

```powershell
cd C:\Users\yoges\uscis-tracker
git add .
git commit -m "Prepare backend deployment and Android production build"
git push origin main
```

Redeploy Render:

1. Open Render dashboard
2. Open `uscis-tracker-backend`
3. Confirm environment variables are set
4. Trigger deploy from latest commit
5. Test `/health`, `/api/case-status`, and `/api/ai-support`

## 7. Play Console Steps After AAB

After the production AAB is ready:

1. Open Google Play Console
2. Open your app
3. Go to `Testing` or `Production`
4. Create a new release
5. Upload the `.aab`
6. Fill release notes
7. Complete store listing, privacy policy, and content forms
8. Start with internal testing before production rollout
