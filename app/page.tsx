'use client';
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    budget: '',
    customization: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem('userForm', JSON.stringify(form));
    window.location.href = '/result';
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-black">
          AI供应链对接助手
        </h1>

        <input
          type="text"
          name="product"
          placeholder="你想找什么产品？"
          value={form.product}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-600"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="数量（如1000）"
          value={form.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-600"
          required
        />

        <input
          type="number"
          name="budget"
          placeholder="预算（加币）"
          value={form.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-600"
        />

        <input
          type="text"
          name="customization"
          placeholder="是否定制（如印logo）"
          value={form.customization}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          提交需求
        </button>
      </form>
    </main>
  );
}
