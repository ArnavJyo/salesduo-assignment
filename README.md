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
  - `.txt` file upload.
  - Returns JSON: `{ summary, decisions: string[], actionItems: { task, owner?, due? }[] }`

### cURL example

.txt file upload (multipart/form-data):

```bash
curl -sS http://localhost:3000/process-meeting \
  -F file=@samples/sample1.txt
```


## Samples

See `samples/sample1.txt` , `samples/sample2.txt` and `samples/sample3.txt`.

## Notes

- Handles missing input, wrong file types, and AI timeouts.
- Uses `GEMINI_MODEL` env to switch models if desired.

## Get Gemini API Key

1. Go to Google AI Studio: `https://aistudio.google.com`.
2. Sign in and create an API key in the Keys section.
3. Copy the key and set it in `.env` as `GEMINI_API_KEY`.
4. Ensure billing/quotas as needed for your account.
