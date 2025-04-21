'use client';
import { useState, useEffect } from 'react';

const questions = [
  { key: 'product', text: '请问你想采购什么产品？（如：背包、T恤、耳机）' },
  { key: 'quantity', text: '你大概需要多少数量？' },
  { key: 'budget', text: '预算大概是多少加币呢？' },
  { key: 'customization', text: '是否需要定制？（比如印LOGO）' },
];

export default function ChatForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    budget: '',
    customization: '',
  });
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<string[]>([
    '🤖 你好，我是你的AI采购顾问，我将一步步了解你的需求，帮你推荐合适的中国工厂！',
    `🤖 ${questions[0].text}`,
  ]);

  const currentQuestion = questions[step];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newForm = { ...form, [currentQuestion.key]: input };

    setChat((prev) => [
      ...prev,
      `🧑 ${input}`,
    ]);
    setForm(newForm);
    setInput('');

    if (step < questions.length - 1) {
      setTimeout(() => {
        const nextStep = step + 1;
        setChat((prev) => [...prev, `🤖 ${questions[nextStep].text}`]);
        setStep(nextStep);
      }, 600);
    } else {
      // 所有问题都回答完
      setChat((prev) => [...prev, '🤖 感谢填写，我将为你查找供应商...']);
      localStorage.setItem('userForm', JSON.stringify(newForm));
      setTimeout(() => {
        window.location.href = '/result';
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-xl space-y-4 h-[500px] overflow-y-auto">
        <h1 className="text-2xl font-bold text-center text-black">AI供应链对话助手</h1>
        <div className="space-y-2">
          {chat.map((msg, i) => (
            <p
              key={i}
              className={`p-2 rounded text-black text-sm sm:text-base ${
                msg.startsWith('🤖')
                  ? 'bg-gray-200 text-left'
                  : 'bg-gray-100 text-right'
              }`}
            >
              {msg}
            </p>
          ))}
        </div>

        {step < questions.length && (
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请输入..."
              className="flex-1 p-2 border rounded text-black"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              发送
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
