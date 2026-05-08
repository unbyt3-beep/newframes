import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const correctPasscode = process.env.ADMIN_PASSCODE || 'admin@12345';
    
    if (passcode === correctPasscode) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid passcode' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
