'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatForm() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<string[]>([
    '🤖 你好，我是你的AI采购顾问，欢迎告诉我你想采购的产品、数量、预算等信息，我会为你智能推荐工厂。',
  ]);
  const [recommended, setRecommended] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const fetchRecommendations = async (formData: any) => {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setRecommended(data);
      setChat((prev) => [...prev, '🤖 以下是我为你推荐的供应商：']);
    } catch (e) {
      console.error('推荐失败', e);
      setChat((prev) => [...prev, '🤖 抱歉，推荐供应商时出现问题。']);
    }
  };

  const extractField = (chat: string[], keyword: string): string => {
    const combined = chat.join('\n');
    const match = combined.match(new RegExp(`${keyword}[：: ]?(.*?)(\\n|$)`));
    return match ? match[1].trim() : '';
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = `🧑 ${input}`;
    const updatedChat = [...chat, userMsg];
    setChat(updatedChat);
    setInput('');

    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedChat.map((msg) => {
          if (msg.startsWith('🤖')) return { role: 'assistant', content: msg.slice(2) };
          if (msg.startsWith('🧑')) return { role: 'user', content: msg.slice(2) };
          return { role: 'system', content: msg };
        }),
      }),
    });

    const { reply } = await res.json();
    const newChat = [...updatedChat, `🤖 ${reply}`];
    setChat(newChat);

    // 简单关键词判断触发推荐
    if (
      reply.includes('为你推荐的供应商') ||
      reply.includes('推荐如下') ||
      reply.includes('我来帮你查找')
    ) {
      const guessedForm = {
        product: extractField(newChat, '产品'),
        quantity: extractField(newChat, '数量'),
        budget: extractField(newChat, '预算'),
        customization: extractField(newChat, '定制'),
      };
      fetchRecommendations(guessedForm);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex p-6 gap-4">
      {/* 左边：推荐结果区域 */}
      <div className="w-1/2 bg-white p-4 rounded shadow overflow-y-auto h-[85vh]">
        <h2 className="text-xl font-bold text-black mb-4">推荐商品</h2>
        {recommended.length === 0 ? (
          <p className="text-gray-500">这里会展示基于你描述的推荐工厂</p>
        ) : (
          recommended.map((item, i) => (
            <div key={i} className="border rounded p-4 shadow-sm mb-2">
              <h3 className="font-bold text-black">{item.name}</h3>
              <p>产品：{item.product}</p>
              <p>起订量：{item.moq}</p>
              <p>单价区间：{item.price}</p>
              <p className="text-sm text-gray-500">{item.note}</p>
            </div>
          ))
        )}
      </div>

      {/* 右边：聊天对话框 */}
      <div className="w-1/2 bg-white p-4 rounded shadow flex flex-col h-[85vh]">
        <h1 className="text-2xl font-bold text-center text-black mb-2">AI采购聊天助手</h1>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chat.map((msg, i) => (
            <p
              key={i}
              className={`p-2 rounded text-black text-sm sm:text-base ${
                msg.startsWith('🤖')
                  ? 'bg-gray-200 text-left'
                  : 'bg-blue-100 text-right'
              }`}
            >
              {msg}
            </p>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* 输入框区域 */}
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
      </div>
    </main>
  );
}
