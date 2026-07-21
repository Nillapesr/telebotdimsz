import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ===== POST: Terima webhook dari Telegram =====
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    // 1. Cari bot di database berdasarkan token
    const bot = await prisma.bot.findUnique({
      where: { token },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    // 2. Parse body dari Telegram
    const body = await req.json();
    const { message, callback_query } = body;

    // 3. Handle pesan
    if (message) {
      await handleMessage(bot, message);
    }

    // 4. Handle callback query (tombol inline)
    if (callback_query) {
      await handleCallbackQuery(bot, callback_query);
    }

    // 5. Balik response 200 OK ke Telegram
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// ===== HANDLER PESAN =====
async function handleMessage(bot: any, message: any) {
  const chatId = message.chat.id;
  const text = message.text || '';

  // Update statistik (opsional)
  await prisma.bot.update({
    where: { id: bot.id },
    data: {
      // Di sini nanti bisa tambahin counter pesan
    },
  });

  // Eksekusi kode custom dari user
  try {
    const userCode = bot.code || `
      module.exports = async (ctx) => {
        await ctx.reply('Halo! Aku bot ${bot.name}');
      };
    `;

    // Buat context buat user code
    const ctx = {
      chatId,
      text,
      message,
      bot,
      reply: async (msg: string) => {
        await sendTelegramMessage(bot.token, chatId, msg);
      },
      replyWithMarkdown: async (msg: string) => {
        await sendTelegramMessage(bot.token, chatId, msg, 'MarkdownV2');
      },
      replyWithHTML: async (msg: string) => {
        await sendTelegramMessage(bot.token, chatId, msg, 'HTML');
      },
    };

    // Eksekusi kode user (pake Function constructor biar aman)
    const fn = new Function('ctx', `
      ${userCode}
      return module.exports(ctx);
    `);

    await fn(ctx);
  } catch (error) {
    console.error('Error executing user code:', error);
    await sendTelegramMessage(
      bot.token,
      chatId,
      '⚠️ Terjadi error saat menjalankan kode bot. Cek log untuk detail.'
    );
  }
}

// ===== HANDLER CALLBACK QUERY =====
async function handleCallbackQuery(bot: any, callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  // Kirim balasan ke callback
  await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQuery.id,
      text: `Kamu klik: ${data}`,
    }),
  });

  // Kirim pesan ke chat
  await sendTelegramMessage(
    bot.token,
    chatId,
    `📌 Kamu memilih: *${data}*`,
    'MarkdownV2'
  );
}

// ===== FUNGSI BANTU: Kirim pesan ke Telegram =====
async function sendTelegramMessage(
  token: string,
  chatId: number,
  text: string,
  parseMode?: 'MarkdownV2' | 'HTML'
) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload: any = {
    chat_id: chatId,
    text,
  };

  if (parseMode) {
    payload.parse_mode = parseMode;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Telegram API error:', error);
    throw new Error(`Telegram API error: ${error.description}`);
  }

  return response.json();
}
