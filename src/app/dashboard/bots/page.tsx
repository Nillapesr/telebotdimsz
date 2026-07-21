import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteBotButton from './_components/DeleteBotButton';
import DeployWebhookButton from './_components/DeployWebhookButton';

export default async function BotsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const bots = await prisma.bot.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight">
            🤖 Bot Saya
          </h1>
          <p className="text-sm uppercase tracking-wider text-gray-600 mt-1">
            Kelola semua bot Telegram kamu di sini
          </p>
        </div>
        <Link
          href="/dashboard/bots/new"
          className="border-4 border-black bg-yellow-400 px-6 py-3 font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          + Buat Bot
        </Link>
      </div>

      {/* List Bot */}
      {bots.length === 0 ? (
        <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-bold uppercase">Belum Ada Bot</p>
          <p className="text-gray-600 mt-2">
            Buat bot Telegram pertamamu sekarang!
          </p>
          <Link
            href="/dashboard/bots/new"
            className="inline-block mt-4 border-4 border-black bg-yellow-400 px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ➕ Buat Bot Baru
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== KOMPONEN KARTU BOT =====
function BotCard({ bot }: { bot: any }) {
  const statusColor = bot.status === 'online' ? 'bg-green-600' : 'bg-red-600';
  const statusText = bot.status === 'online' ? '● Online' : '● Offline';

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
      {/* Nama & Status */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{bot.name}</h3>
          <p className="text-sm text-gray-600 truncate max-w-xs">
            {bot.description || 'Bot Telegram'}
          </p>
        </div>
        <span className={`${statusColor} text-white px-3 py-1 text-xs font-bold uppercase whitespace-nowrap ml-2`}>
          {statusText}
        </span>
      </div>

      {/* Token (di-masking) */}
      <div className="border-2 border-black bg-[#f5f2eb] p-2 mb-3 font-mono text-xs truncate">
        Token: {bot.token.substring(0, 10)}...{bot.token.substring(bot.token.length - 6)}
      </div>

      {/* Webhook URL */}
      <div className="border-2 border-black bg-[#f5f2eb] p-2 mb-4 font-mono text-xs truncate">
        Webhook: {bot.webhookUrl || 'Belum diset'}
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/dashboard/bots/${bot.id}`}
          className="flex-1 border-2 border-black px-4 py-2 text-center font-bold text-sm hover:bg-yellow-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          ✏️ Edit
        </Link>

        <DeployWebhookButton botId={bot.id} token={bot.token} />

        <DeleteBotButton botId={bot.id} botName={bot.name} />
      </div>
    </div>
  );
}
