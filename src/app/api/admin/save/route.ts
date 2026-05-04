import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the Service Role key (bypasses RLS)
const supabaseUrl = 'https://upzictdpfybsbbezcdhf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { passcode, data } = await request.json();
    const correctPasscode = process.env.ADMIN_PASSCODE || 'admin@12345';
    
    if (passcode !== correctPasscode) {
      return NextResponse.json({ success: false, error: 'Invalid passcode' }, { status: 401 });
    }

    if (!supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_role_key_here') {
        return NextResponse.json({ success: false, error: 'Please set your SUPABASE_SERVICE_ROLE_KEY in .env.local first.' }, { status: 500 });
    }
    
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ id: 1, data });
      
    if (error) {
      console.error('Supabase save error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
