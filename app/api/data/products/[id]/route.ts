import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ ok: true, data: null }, { status: 200 });
    }
    const { ProductService } = await import('@/lib/db/services');
    const product = await ProductService.getProductById(id);
    return NextResponse.json({ ok: true, data: product }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to fetch product' }, { status: 500 });
  }
}
