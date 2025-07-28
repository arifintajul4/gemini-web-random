import OpenAI from 'openai';

async function getHtml() {
  const openai = new OpenAI({
    baseURL: 'https://api.akbxr.com/v1',
    apiKey: process.env.AKBXR_API_KEY || 'UNLIMITED-BETA',
  });
  const tema = process.env.THEME || 'random';
  return new Promise(async (resolve, reject) => {
    try {
      const completion = await openai.chat.completions.create({
        model: 'auto',
        messages: [
          {
            role: 'user',
            content: `buatkan landing page html dengan css sederhana, dengan tema ${tema}, konten lengkap di 1 halaman, tidak perlu ada tombol ke halaman lain. Jangan ada penjelasan, langsung saja berikan kode html dan css nya)`,
          },
        ],
      });
      resolve(completion.choices[0].message.content);
    } catch (error) {
      reject(error);
    }
  });
}

export default async function handler(req, res) {
  const htmlContent = await getHtml().catch((error) => {
    console.error(error);
    res.status(500).send(error);
    return;
  });

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(htmlContent);
}
