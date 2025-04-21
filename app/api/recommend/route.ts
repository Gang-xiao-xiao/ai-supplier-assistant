import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { product, quantity, budget } = await req.json();

  const prompt = `根据以下用户输入，推荐3家适合的中国供应商，并列出产品类型、起订量、参考单价、推荐理由：
产品名：${product}
数量：${quantity}
预算：${budget}加币
请使用JSON数组格式返回，例如：
[
  {
    "name": "XXX公司",
    "product": "XXXX",
    "moq": 100,
    "price": "1.5 ~ 2.5 CAD",
    "note": "支持定制logo，快速发货"
  }
]`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;

  return NextResponse.json(JSON.parse(raw));
}
