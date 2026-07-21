'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBotPage() {
  const router = useRouter();
  const params = useParams();
  const botId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    code: '',
  });

  // Ambil data bot
  useEffect(() => {
    async function fetchBot() {
      try {
        const res = await fetch(`/api/bots/${botId}`);
        if (res.ok) {
          const bot = await res.json();
          setForm({
            name: bot.name || '',
            description: bot.description || '',
            code: bot.code || '',
          });
        } else {
          setError('Gagal mengambil data bot');
        }
      } catch (err) {
        setError('Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }

    if (botId) {
      fetchBot();
    }
  }, [botId]);

  // Simpan perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard/bots');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <p className="text-xl font-bold uppercase">Memuat...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight">
            ✏️ Edit Bot
          </h1>
          <p className="text-sm uppercase tracking-wider text-gray-600 mt-1">
            {form.name || 'Bot tanpa nama'}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="border-4 border-black px-6 py-3 font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          ← Kembali
        </button>
      </div>

      {/* Form */}
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Nama Bot
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Deskripsi
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Kode Custom */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Kode Bot (JavaScript)
            </label>
            <textarea
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              rows={10}
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              spellCheck={false}
            />
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">
              Fungsi yang diekspor: <code className="bg-black text-white px-1">module.exports = async (ctx) =&gt; {{ ... }}</code>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="border-3 border-red-600 bg-red-100 p-3 font-bold text-red-800">
              ⚠ {error}
            </div>
          )}

          {/* Tombol */}
          <div className="flex gap-4 pt-4 border-t-4 border-black">
            <button
              type="button"
              onClick={() => router.back()}
              className="border-3 border-black px-6 py-3 font-bold uppercase hover:bg-gray-200 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 border-4 border-black bg-yellow-400 px-6 py-3 font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
