import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/family {name}
 * Stub create. Returns invite code. (v1.1 full impl with RLS family tables)
 * GET returns list (empty).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = (body as any).name || 'Sangha'; // eslint-disable-line @typescript-eslint/no-explicit-any
  return NextResponse.json({
    ok: true,
    family: {
      id: 'fam_' + Date.now().toString(36),
      name,
      invite_code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    },
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    families: [],
    message: 'Family Sangha — full multi-user coming in v1.1',
  });
}
