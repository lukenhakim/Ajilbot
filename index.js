import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// ==== Setup __dirname untuk ES Modules ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==== Inisialisasi client Gemini AI ====
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = 'gemini-3.5-flash';

// ==== System Instruction: menetapkan persona chatbot ====
// Use case: AjilBot - Asisten Belajar AI Engineering untuk siswa SMK (PPLG)
const SYSTEM_INSTRUCTION = `
Kamu adalah "AjilBot", asisten belajar AI Engineering untuk siswa SMK Muhammadiyah jurusan
Pengembangan Perangkat Lunak dan Gim (PPLG).

Aturan gaya bicara:
- Gunakan bahasa Indonesia yang santai, ramah, dan mudah dipahami siswa SMK.
- Boleh sesekali pakai emoji supaya tidak kaku, tapi jangan berlebihan.
- Jelaskan konsep AI (seperti machine learning, deep learning, LLM, prompting, API)
  dengan analogi sederhana dan contoh kode singkat kalau relevan.
- Jika siswa bertanya di luar topik AI/programming, tetap jawab dengan sopan
  tapi arahkan kembali ke topik belajar jika memungkinkan.
- Jangan pernah memberikan jawaban tugas ujian secara instan tanpa penjelasan;
  selalu sertakan penjelasan supaya siswa benar-benar paham.
- Jawaban jangan terlalu panjang kecuali diminta detail.
`;

// ==== Middleware ====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==== Endpoint utama chatbot ====
app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;

  try {
    if (!Array.isArray(conversation)) {
      throw new Error('Messages must be an array!');
    }

    // Ubah format conversation ke format yang dibutuhkan Gemini SDK
    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 32,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error('Error saat generate content:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AjilBot Chatbot running on http://localhost:${PORT}`));
