import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Kalau belum login, redirect ke login
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#f0ede8] flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 border-r-4 border-black bg-white p-6 flex flex-col shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] min-h-screen">
        {/* Logo */}
        <div className="border-b-4 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            ⬡ TeleForge
          </h1>
          <p className="text-xs uppercase tracking-wider text-gray-600 mt-1">
            Brutal Bot Platform
          </p>
        </div>

        {/* User Info */}
        <div className="border-3 border-black p-3 mb-6 bg-[#f5f2eb]">
          <p className="text-sm font-bold truncate">{session.user.name || session.user.email}</p>
          <p className="text-xs text-gray-600 truncate">{session.user.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <NavLink href="/dashboard" icon="📊">
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/bots" icon="🤖">
            Bot Saya
          </NavLink>
          <NavLink href="/dashboard/bots/new" icon="➕">
            Buat Bot
          </NavLink>
          <NavLink href="/dashboard/logs" icon="📟">
            Activity Log
          </NavLink>
          <NavLink href="/dashboard/settings" icon="⚙️">
            Settings
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="border-t-4 border-black pt-4 mt-auto">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full border-3 border-black bg-red-100 p-3 font-bold uppercase text-sm hover:bg-red-200 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              ⚡ Logout
            </button>
          </form>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

// ===== KOMPONEN NAV LINK =====
function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block border-2 border-black p-3 font-bold uppercase text-sm hover:bg-yellow-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
    >
      <span className="mr-2">{icon}</span>
      {children}
    </Link>
  );
}
