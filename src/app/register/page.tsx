'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi password match
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Berhasil daftar, redirect ke login
        router.push('/login?registered=true');
      } else {
        setError(data.error || 'Gagal mendaftar, coba lagi');
      }
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0ede8] p-4">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Logo */}
        <div className="mb-6 border-b-4 border-black pb-2">
          <h1 className="text-3xl font-bold uppercase tracking-tight">
            ⬡ TeleForge
          </h1>
          <p className="text-sm uppercase tracking-wider text-gray-600 mt-1">
            Brutal Bot Platform
          </p>
        </div>

        <p className="text-sm font-bold uppercase mb-6">Daftar akun baru</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
              minLength={6}
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full border-3 border-black p-3 bg-[#f5f2eb] font-mono focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="border-3 border-red-600 bg-red-100 p-3 font-bold text-red-800">
              ⚠ {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full border-4 border-black bg-yellow-400 p-4 font-bold uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : '⚡ Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm border-t-2 border-black pt-4">
          Sudah punya akun?{' '}
          <a href="/login" className="font-bold underline underline-offset-4 hover:bg-black hover:text-white transition-colors px-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
