# Final Release Steps

## Backend URL

Production backend base URL:

- `https://uscis-tracker-site.onrender.com`

Important:

- do not use `/health` as the frontend API base URL
- `/health` is only for backend verification
- it is normal for the backend root URL to show `Cannot GET /` because this is an API server

## Render Environment Variables

Set these on Render:

- `USCIS_MODE=mock`
- `GROQ_API_KEY=your_real_key`
- `GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions`
- `GROQ_MODEL=llama-3.3-70b-versatile`

## Backend Verification

Use this endpoint to verify the backend is up:

- `https://uscis-tracker-site.onrender.com/health`

Expected response:

```json
{
  "ok": true,
  "message": "Backend is running",
  "mode": "mock"
}
```

## Android Production Build Command

Run this from the app root:

```powershell
eas build --platform android --profile production
```

## Basic Test Checklist Before Release

- Home status check works
- Save case works
- My Cases loads saved cases
- AI Support replies
- Hindi, Spanish, and English switching works

## Notes

- Production builds use the Render backend automatically
- Development builds still use the local dev logic in `config/api.ts`
- If the backend root URL returns `Cannot GET /`, that is okay
- `/health` is the correct endpoint for backend verification
