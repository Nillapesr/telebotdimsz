import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// ===== GET: Ambil semua bot milik user =====
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bots = await prisma.bot.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error('GET /api/bots error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// ===== POST: Buat bot baru =====
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, token, description } = body;

    // Validasi input
    if (!name || !token) {
      return NextResponse.json(
        { error: 'Nama bot dan token wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi format token Telegram
    if (!token.includes(':') || token.split(':').length !== 2) {
      return NextResponse.json(
        { error: 'Format token tidak valid. Contoh: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz' },
        { status: 400 }
      );
    }

    // Cek apakah token sudah dipakai user lain
    const existingBot = await prisma.bot.findUnique({
      where: { token },
    });

    if (existingBot) {
      return NextResponse.json(
        { error: 'Token sudah digunakan oleh bot lain' },
        { status: 400 }
      );
    }

    // Generate webhook URL (akan di-set nanti)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/telegram/webhook/${token}`;

    // Simpan bot ke database
    const bot = await prisma.bot.create({
      data: {
        name,
        token,
        description: description || `Bot Telegram ${name}`,
        status: 'offline',
        webhookUrl,
        userId: session.user.id,
        code: `module.exports = async (ctx) => {
  await ctx.reply('Halo! Aku bot ${name}. Siap membantu!');
};`,
      },
    });

    // (Opsional) Coba set webhook ke Telegram
    try {
      await setTelegramWebhook(token, webhookUrl);
      // Update status jadi online kalau berhasil
      await prisma.bot.update({
        where: { id: bot.id },
        data: { status: 'online' },
      });
    } catch (webhookError) {
      console.warn('Gagal set webhook, bot tetap disimpan:', webhookError);
      // Bot tetap tersimpan, status offline
    }

    return NextResponse.json(
      {
        success: true,
        bot: {
          id: bot.id,
          name: bot.name,
          token: bot.token,
          status: bot.status,
          webhookUrl: bot.webhookUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/bots error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// ===== FUNGSI BANTU: Set webhook ke Telegram =====
async function setTelegramWebhook(token: string, webhookUrl: string) {
  const url = `https://api.telegram.org/bot${token}/setWebhook`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: process.env.WEBHOOK_SECRET || 'default_secret',
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }
  return data;
}
