import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// ===== GET: Ambil detail bot =====
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bot = await prisma.bot.findUnique({
      where: { id: params.id },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 });
    }

    // Cek apakah bot milik user yang login
    if (bot.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error('GET /api/bots/[id] error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// ===== PUT: Update bot =====
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, code } = body;

    // Cek apakah bot ada dan milik user
    const existingBot = await prisma.bot.findUnique({
      where: { id: params.id },
    });

    if (!existingBot) {
      return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 });
    }

    if (existingBot.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update bot
    const updatedBot = await prisma.bot.update({
      where: { id: params.id },
      data: {
        name: name || existingBot.name,
        description: description || existingBot.description,
        code: code || existingBot.code,
      },
    });

    return NextResponse.json({
      success: true,
      bot: updatedBot,
    });
  } catch (error) {
    console.error('PUT /api/bots/[id] error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// ===== DELETE: Hapus bot =====
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cek apakah bot ada dan milik user
    const existingBot = await prisma.bot.findUnique({
      where: { id: params.id },
    });

    if (!existingBot) {
      return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 });
    }

    if (existingBot.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Hapus webhook di Telegram (optional)
    try {
      await fetch(
        `https://api.telegram.org/bot${existingBot.token}/deleteWebhook`,
        { method: 'POST' }
      );
    } catch (webhookError) {
      console.warn('Gagal delete webhook:', webhookError);
    }

    // Hapus bot dari database
    await prisma.bot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/bots/[id] error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
