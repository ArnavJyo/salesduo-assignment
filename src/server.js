import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());

const upload = multer({ storage: multer.memoryStorage()});

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


async function extractMeetingInsights(rawText) {
  const schema = {
    type: 'OBJECT',
    properties: {
      summary: { type: 'STRING' },
      decisions: { type: 'ARRAY', items: { type: 'STRING' } },
      actionItems: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            task: { type: 'STRING' },
            owner: { type: 'STRING', nullable: true },
            due: { type: 'STRING', nullable: true }
          },
          required: ['task']
        }
      }
    },
    required: ['summary', 'decisions', 'actionItems']
  };

  const prompt = `Extract structured meeting minutes from the notes below. Return ONLY JSON (no markdown) matching the provided schema. Summary must be 2–3 sentences. Omit unknown optional fields. Be very careful about the context and information , some information provided in notes might be universally applicable to all tasks too but mention those properties to actionItems aswell .\n\nNotes:\n${rawText}`;

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: schema
    }
  });

  const result = await model.generateContent(prompt);
  const text = result.response?.text?.() || result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {};
  }

  const outputSchema = z.object({
    summary: z.string().min(1),
    decisions: z.array(z.string()).default([]),
    actionItems: z.array(z.object({
      task: z.string().min(1),
      owner: z.string().nullable().optional(),
      due: z.string().nullable().optional()
    })).default([])
  });

  return outputSchema.parse(parsed);
}

app.post('/process-meeting', upload.any(), async (req, res) => {
  const contentType = req.headers['content-type'] || '';

  try {
    let rawText = '';
    // Text file upload validation (any field name)
    const files = req.files || [];
    const preferred = files[0];
    console.log("Preffered", preferred);
   
    if (preferred) {
      const isTxt = preferred.mimetype === 'text/plain' || (preferred.originalname || '').toLowerCase().endsWith('.txt');
      if (!isTxt) {
        return res.status(400).json({ error: 'Only .txt files are supported' });
      }
      
      rawText = preferred.buffer.toString('utf-8');
    } 

    // GEMINI_API_KEY validation
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const result = await extractMeetingInsights(rawText);
    return res.status(200).json(result);

  } 
  catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(502).json({ error: 'AI response validation failed', details: err.issues });
    }
    if (String(err?.message || '').includes('404') && String(err?.message || '').includes('models/')) {
      return res.status(502).json({
        error: 'Model not found or not supported for generateContent',
        message: err?.message,
        hint: 'Set GEMINI_MODEL to a supported model like gemini-1.5-flash-001 or gemini-1.5-pro-001. Avoid using -latest.',
      });
    }
    const isTimeout = /timeout/i.test(String(err?.message));
    const status = isTimeout ? 504 : 502;
    return res.status(status).json({ error: 'Failed to process meeting', message: err?.message || 'Unknown error' });
  }
});

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Hello Welcome to the AI Minutes of Meeting Extractor API. use /process-meeting route to process your minutes of the meeting' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


