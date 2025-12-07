import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ ok: true, data: [] }, { status: 200 });
    }
    
    const { supabase } = await import('@/lib/supabase');
    
    if (!supabase) {
      return NextResponse.json({ ok: true, data: [] }, { status: 200 });
    }
    
    // Only allow users to fetch their own data unless they're admin
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_id', userId)
      .single();
    
    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }
    
    // If user not found, return empty array
    if (!userData) {
      return NextResponse.json({ ok: true, data: [] }, { status: 200 });
    }
    
    return NextResponse.json({ ok: true, data: [userData] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to fetch user data' }, { status: 500 });
  }
}
