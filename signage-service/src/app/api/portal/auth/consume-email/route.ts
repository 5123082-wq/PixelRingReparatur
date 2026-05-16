import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Portal magic-link login is no longer active.' },
    { status: 410 }
  );
}
