import crypto from 'crypto';

export type TGUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export interface ValidateResult {
  ok: boolean;
  user?: TGUser;
  error?: string;
}

export function validateInitData(initData: string, botToken: string): ValidateResult {
  if (!initData || !botToken) {
    return { ok: false, error: 'Missing initData or bot token' };
  }
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { ok: false, error: 'No hash' };

    params.delete('hash');
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const computed = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

    if (computed !== hash) {
      return { ok: false, error: 'Invalid hash' };
    }

    const userStr = params.get('user');
    if (!userStr) return { ok: false, error: 'No user' };
    const user: TGUser = JSON.parse(userStr);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function getUserFromInitData(initData: string, botToken: string): TGUser | null {
  const res = validateInitData(initData, botToken);
  return res.ok ? res.user! : null;
}
