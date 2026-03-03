'use client';
import { useState } from 'react';

export default function AskAI() {
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });
    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Ask OracleX AI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Analyze Manchester City vs Liverpool"
          className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {reply && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <p className="text-gray-300">{reply}</p>
        </div>
      )}
    </div>
  );
}
