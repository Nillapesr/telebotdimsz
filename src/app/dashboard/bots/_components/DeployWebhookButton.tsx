'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeployWebhookButton({
  botId,
  token,
}: {
  botId: string;
  token: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bots/${botId}/deploy-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal deploy webhook');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeploy}
      disabled={loading}
      className="flex-1 border-2 border-black bg-blue-100 px-4 py-2 font-bold text-sm hover:bg-blue-200 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50"
    >
      {loading ? '...' : '🔄 Deploy Webhook'}
    </button>
  );
}
