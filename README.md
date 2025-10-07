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

### Test using cURL 

.txt file upload (multipart/form-data):
The file path mentioned here is relative to the project directory to use this exact command to test via cURL make sure you are in project directory 
```bash
curl -sS http://localhost:3000/process-meeting \
  -F file=@samples/sample1.txt
```
### Test using Postman
1. Open Postman → Create a new POST request.

2. ```bash 
http://localhost:3000/process-meeting 
```
3. Go to Body → form-data.

4 Add one field:

Key: file

Type: File (from dropdown)

Value: (select your .txt file, e.g. meeting_notes.txt)

5. Click Send.




## Sample Input 

**Meeting Title:** Candidate Interview – Software Engineer (Full Stack)
**Date:** October 7, 2025
**Attendees:**

* Interview Panel: Ravi Singh
* Candidate: Arnav Jyotshi
* Role: Software Engineer (Full Stack)


* Candidate introduced background in Node.js, React.js, and PostgreSQL.
* Discussed previous experience in building REST APIs and handling scalable microservices.
* Candidate showcased project on loan management dashboard; explained integration with third-party APIs and React-based frontend improvements.
* Technical assessment focused on async/await, error handling, and database transactions using Sequelize.
* Candidate demonstrated strong debugging and optimization skills.
* Behavioral round covered teamwork, adaptability, and ownership in fast-paced startup environments.


* Strengths: solid full stack knowledge, clear communication, strong problem-solving approach.
* Areas for improvement: could deepen understanding of system design patterns and cloud deployment strategies.


* Candidate shortlisted for final round (System Design + Cultural Fit).


* HR to schedule final interview by Oct 10.
* Technical panel to prepare scenario-based system design questions.

## Sample Output
{
    "summary": "Arnav Jyotshi was interviewed for the Software Engineer (Full Stack) role, demonstrating strong skills in Node.js, React.js, PostgreSQL, and problem-solving. The technical and behavioral rounds highlighted his experience in building scalable microservices and a loan management dashboard. Based on his performance, Arnav has been shortlisted for the final interview round.",
    "decisions": [
        "Candidate shortlisted for final round (System Design + Cultural Fit)."
    ],
    "actionItems": [
        {
            "task": "HR to schedule final interview",
            "owner": "HR",
            "due": "Oct 10"
        },
        {
            "task": "Technical panel to prepare scenario-based system design questions",
            "owner": "Technical panel"
        }
    ]
} 



## Checkout other samples to test
See `samples/sample1.txt` , `samples/sample2.txt` and `samples/sample3.txt`.


## Notes

- Handles missing input, wrong file types, and AI timeouts.
- Uses `GEMINI_MODEL` env to switch models if desired.

## Get Gemini API Key

1. Go to Google AI Studio: `https://aistudio.google.com`.
2. Sign in and create an API key in the Keys section.
3. Copy the key and set it in `.env` as `GEMINI_API_KEY`.
4. Ensure billing/quotas as needed for your account.

