import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = body.name || 'Sangha';

  // Stub
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
    message: 'Family Sangha coming in v1.1',
  });
}
