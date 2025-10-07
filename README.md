# AI-Powered Meeting Minutes Extractor

Backend service that accepts meeting notes and returns structured JSON with summary, decisions, and action items using Google Gemini.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file at the project root with:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash-001
PORT=3000
```

## Run

```bash
npm run dev
```


## Endpoint

- POST `/process-meeting`
  - Accepts raw text in body (text/plain), JSON `{ "text": "..." }`, or `.txt` file upload (field name `file`).
  - Returns JSON: `{ summary, decisions: string[], actionItems: { task, owner?, due? }[] }`

### cURL examples

Raw text (text/plain):

```bash
curl -sS http://localhost:3000/process-meeting \
  -H 'Content-Type: text/plain' \
  --data-binary $'Team Sync – May 26\n\n- We’ll launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard.'
```

JSON body:

```bash
curl -sS http://localhost:3000/process-meeting \
  -H 'Content-Type: application/json' \
  -d '{"text":"Team Sync – May 26\n\n- We’ll launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."}'
```

.txt file upload (multipart/form-data):

```bash
curl -sS http://localhost:3000/process-meeting \
  -F file=@samples/sample1.txt
```

## Samples

See `samples/sample1.txt` and `samples/sample2.txt`.

## Notes

- Handles missing input, wrong file types, and AI timeouts.
- Uses `GEMINI_MODEL` env to switch models if desired.

## Get Gemini API Key

1. Go to Google AI Studio: `https://aistudio.google.com`.
2. Sign in and create an API key in the Keys section.
3. Copy the key and set it in `.env` as `GEMINI_API_KEY`.
4. Ensure billing/quotas as needed for your account.

Valid models (examples):
- `gemini-1.5-flash-001`
- `gemini-1.5-pro-001`
Avoid `-latest` aliases as they may 404 in some API versions.