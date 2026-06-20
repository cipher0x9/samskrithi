import { NextRequest, NextResponse } from 'next/server';
import { validateInitData, type TGUser } from '@/lib/tg';
import { supabaseServer } from '@/lib/supabase';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * POST /api/validate
 * Validates Telegram WebApp initData (HMAC-SHA256).
 * Input: { initData: string }
 * Output: { ok, user?, tier, _dev? }
 * Errors: 400 bad input, 401 invalid, 500 server.
 * NOTE: Rate limit should be added at edge or via middleware (per IP + user).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const initData: string = (body as { initData?: string }).initData || '';

    if (!initData || typeof initData !== 'string') {
      return NextResponse.json({ ok: false, error: 'no initData' }, { status: 400 });
    }

    const result = validateInitData(initData, BOT_TOKEN);

    if (!result.ok || !result.user) {
      if (process.env.NODE_ENV !== 'production' && !BOT_TOKEN) {
        const mock: TGUser = { id: 123456789, first_name: 'DevUser', username: 'dev' };
        return NextResponse.json({ ok: true, user: mock, tier: 'free', _dev: true });
      }
      return NextResponse.json({ ok: false, error: result.error || 'Invalid Telegram initData' }, { status: 401 });
    }

    const tgUser = result.user;

    // Service role upsert bypasses RLS
    await supabaseServer.from('users').upsert({
      id: tgUser.id,
      username: tgUser.username,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name,
      language_code: tgUser.language_code || 'en',
      last_active: new Date().toISOString(),
    }, { onConflict: 'id' });

    return NextResponse.json({ ok: true, user: tgUser, tier: 'free' });
  } catch {
    return NextResponse.json({ ok: false, error: 'validate_failed' }, { status: 500 });
  }
}
