import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ ok: true, data: [] }, { status: 200 });
    }
    const { CategoryService } = await import('@/lib/db/services');
    const categories = await CategoryService.getCategories();
    return NextResponse.json({ ok: true, data: categories }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to fetch categories' }, { status: 500 });
  }
}
