# EduBot - Chatbot AI Engineering (Gemini AI)

Chatbot ini adalah tugas Hacktiv8 Sesi 3 "Pembuatan Chatbot berbasis Gemini AI Model".

**Use case**: Asisten belajar AI Engineering untuk siswa SMK PPLG (santai, ramah, kasih contoh & analogi).
**Parameter kreatif**: temperature 0.7, top_p 0.9, top_k 32, system instruction sebagai "guru pendamping" AI.

## Cara menjalankan

1. Install dependencies:
   ```
   npm install
   ```
2. Salin `.env.example` menjadi `.env`, lalu isi API key Gemini kamu:
   ```
   GEMINI_API_KEY=isi_dengan_api_key_asli
   ```
3. Jalankan server:
   ```
   npm start
   ```
4. Buka browser: http://localhost:3000

## Submit ke GitHub

```
git init
git add .
git commit -m "Implementasi EduBot - chatbot Gemini AI"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Lalu submit URL repo + screenshot UI ke form pengumpulan tugas.
