import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: VITE_GEMINI_API_KEY not found in .env');
  process.exit(1);
}

async function testGemini() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;


  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Explain the role of IoU in cadastral parcel matching in 1 sentence.' }] }]
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
}

testGemini();


