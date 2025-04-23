// /app/api/gpt/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // 环境变量中写入你的 key
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  return NextResponse.json({ reply });
}
