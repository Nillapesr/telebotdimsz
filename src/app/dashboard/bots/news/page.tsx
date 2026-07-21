'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    token: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi sederhana
    if (!form.name || !form.token) {
      setError('Nama bot dan token wajib diisi');
      setLoading(false);
      return;
    }

    if (!form.token.startsWith('') || form.token.split(':').length !== 2) {
      setError('Format token tidak valid. Contoh: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/bots');
      } else {
        setError(data.error || 'Gagal membuat bot');
      }
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight">
            ➕ Buat Bot Baru
          </h1>
          <p className="text-sm uppercase tracking-wider text-gray-600 mt-1">
            Dapatkan token dari @BotFather di Telegram
          </p>
        </div>
        <a
          href="https://t.me/botfather"
          target="_blank"
          rel="noopener noreferrer"
          className="border-4 border-black bg-blue-400 px-6 py-3 font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-sm"
        >
          🤖 @BotFather
        </a>
      </div>

      {/* Form */}
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Bot */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Nama Bot <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Misal: @my_awesome_bot"
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">
              Nama unik untuk bot kamu (tanpa @)
            </p>
          </div>

          {/* Token */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Token Bot <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">
              Token dari @BotFather setelah membuat bot
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Apa fungsi bot ini?"
              rows={3}
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="border-3 border-red-600 bg-red-100 p-3 font-bold text-red-800">
              ⚠ {error}
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex gap-4 pt-4 border-t-4 border-black">
            <button
              type="button"
              onClick={() => router.back()}
              className="border-3 border-black px-6 py-3 font-bold uppercase hover:bg-gray-200 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              ← Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 border-4 border-black bg-yellow-400 px-6 py-3 font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : '⚡ Buat Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
