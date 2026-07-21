'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteBotButton({
  botId,
  botName,
}: {
  botId: string;
  botName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Gagal menghapus bot');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 border-2 border-black bg-red-600 text-white px-4 py-2 font-bold text-sm hover:bg-red-700 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50"
        >
          {loading ? '...' : '✅ Yakin'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="border-2 border-black px-4 py-2 font-bold text-sm hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex-1 border-2 border-black bg-red-100 px-4 py-2 font-bold text-sm hover:bg-red-200 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
    >
      🗑️ Hapus
    </button>
  );
}
