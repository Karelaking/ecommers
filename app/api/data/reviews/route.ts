import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin as db } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !db) {
      return NextResponse.json({ ok: true, data: [] }, { status: 200 });
    }
    
    // Only allow users to fetch their own reviews
    const { data, error } = await db
      .from('reviews')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, title, content } = body;

    if (!productId || !rating || !title || !content) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !db) {
      return NextResponse.json({ ok: false, error: 'Database not configured' }, { status: 500 });
    }
    
    const { data, error } = await db
      .from('reviews')
      .insert({
        user_id: userId,
        product_id: productId,
        rating,
        title,
        content,
        verified: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to create review' }, { status: 500 });
  }
}
