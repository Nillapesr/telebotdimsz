import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cek bot
    const bot = await prisma.bot.findUnique({
      where: { id: params.id },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 });
    }

    if (bot.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate webhook URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/telegram/webhook/${bot.token}`;

    // Set webhook ke Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${bot.token}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          secret_token: process.env.WEBHOOK_SECRET || 'default_secret',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        { error: `Telegram API error: ${data.description}` },
        { status: 400 }
      );
    }

    // Update status bot jadi online
    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        status: 'online',
        webhookUrl,
      },
    });

    return NextResponse.json({
      success: true,
      webhookUrl,
      telegramResponse: data,
    });
  } catch (error) {
    console.error('Deploy webhook error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
