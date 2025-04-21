'use client';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const form = JSON.parse(localStorage.getItem('userForm') || '{}');

    const fetchData = async () => {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setSuppliers(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">AI正在生成推荐中...</p>;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">AI推荐供应商</h1>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {suppliers.map((s, i) => (
          <div key={i} className="bg-white shadow p-4 rounded border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-black">{s.name}</h2>
            <p className="text-base text-gray-800">产品：{s.product}</p>
            <p className="text-base text-gray-800">起订量：{s.moq}</p>
            <p className="text-base text-gray-800">单价区间：{s.price}</p>
            <p className="text-sm text-gray-700 italic">{s.note}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
