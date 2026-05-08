import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the Service Role key (bypasses RLS)
const supabaseUrl = 'https://upzictdpfybsbbezcdhf.supabase.co/rest/v1/';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { passcode, data } = await request.json();
    const correctPasscode = process.env.ADMIN_PASSCODE || 'admin@12345';

    if (passcode !== correctPasscode) {
      return NextResponse.json({ success: false, error: 'Invalid passcode' }, { status: 401 });
    }

    if (!supabaseServiceKey || supabaseServiceKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwemljdGRwZnlic2JiZXpjZGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQ1MDQ5NiwiZXhwIjoyMDkzMDI2NDk2fQ.ROt50uOvlyFtyUvcS8RRFUTrn84nyUPS7hUCOEj3VEk') {
      return NextResponse.json({ success: false, error: 'Please set your SUPABASE_SERVICE_ROLE_KEY in .env.local first.' }, { status: 500 });
    }

    // Since the table doesn't have auto-increment, we fetch the max ID manually
    const { data: rows } = await supabaseAdmin
      .from('site_settings')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    const newId = (rows && rows.length > 0 ? rows[0].id : 0) + 1;

    const { error } = await supabaseAdmin
      .from('site_settings')
      .insert({
        id: newId,
        data
      });

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
