import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Ambil data bot dari database
  const bots = await prisma.bot.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  const totalBots = bots.length;
  const onlineBots = bots.filter((b) => b.status === 'online').length;
  const totalMessages = 0; // TODO: tambahin tracking pesan nanti

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm uppercase tracking-wider text-gray-600 mt-1">
            Selamat datang, {session.user.name || session.user.email}!
          </p>
        </div>
        <Link
          href="/dashboard/bots/new"
          className="border-4 border-black bg-yellow-400 px-6 py-3 font-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          + Buat Bot
        </Link>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard number={totalBots} label="Total Bot" />
        <StatCard number={onlineBots} label="Online" />
        <StatCard number={totalMessages} label="Total Pesan" />
      </div>

      {/* ===== BOT LIST ===== */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-bold uppercase border-b-4 border-black pb-2 mb-4">
          🤖 Bot Kamu
        </h2>

        {bots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-bold uppercase">Belum ada bot</p>
            <p className="text-sm text-gray-600 mt-2">
              Buat bot pertama kamu sekarang!
            </p>
            <Link
              href="/dashboard/bots/new"
              className="inline-block mt-4 border-4 border-black bg-yellow-400 px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              ➕ Buat Bot Baru
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== KOMPONEN STAT CARD =====
function StatCard({ number, label }: { number: number; label: string }) {
  return (
    <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <span className="text-5xl font-bold block">{number}</span>
      <span className="text-sm font-bold uppercase border-t-4 border-black pt-2 inline-block mt-1">
        {label}
      </span>
    </div>
  );
}

// ===== KOMPONEN BOT CARD =====
function BotCard({ bot }: { bot: any }) {
  const statusColor = bot.status === 'online' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className="border-3 border-black p-4 flex justify-between items-center bg-[#f5f2eb] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <div>
        <p className="font-bold text-lg">{bot.name}</p>
        <p className="text-sm text-gray-600 truncate max-w-xs">{bot.description || 'Bot Telegram'}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`${statusColor} text-white px-3 py-1 text-xs font-bold uppercase`}>
          ● {bot.status}
        </span>
        <Link
          href={`/dashboard/bots/${bot.id}`}
          className="border-2 border-black px-4 py-2 font-bold text-sm hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
