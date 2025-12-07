import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get('limit') ?? '20');
  const page = Number(url.searchParams.get('page') ?? '1');
  const sort = url.searchParams.get('sort') ?? 'newest';
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ ok: true, data: [], pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }, { status: 200 });
    }
    const { ProductService } = await import('@/lib/db/services');
    const res = await ProductService.getProducts({}, page, limit, sort);
    return NextResponse.json({ ok: true, data: res.data, pagination: res.pagination }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to fetch products' }, { status: 500 });
  }
}
