import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: 'DB client not available' }, { status: 500 });
  }
  try {
    const { data: cat, error: e1 } = await supabaseAdmin
      .from('categories')
      .insert({ name: 'Demo Electronics', slug: 'demo-electronics', description: 'Demo category', image: '', is_active: true })
      .select('id')
      .single();
    if (e1) throw e1;
    const categoryId = (cat?.id) as string;

    const { data: prod, error: e2 } = await supabaseAdmin
      .from('products')
      .insert({ name: 'Demo Headphones', description: 'Seed product for demo', price: 59.99, category_id: categoryId, sku: 'DEMO-HEAD', inventory: 20, status: 'active' })
      .select('*')
      .single();
    if (e2) throw e2;
    const productId = (prod?.id) as string;

    await supabaseAdmin.from('product_images').insert({ product_id: productId, url: 'https://picsum.photos/seed/demo/600/400', alt: 'Demo headphones', order_index: 0, is_primary: true });

    return NextResponse.json({ ok: true, categoryId, productId }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
