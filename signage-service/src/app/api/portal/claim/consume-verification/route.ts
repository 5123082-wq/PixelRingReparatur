import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Portal claim verification now uses e-mail code and password auth.' },
    { status: 410 }
  );
}
