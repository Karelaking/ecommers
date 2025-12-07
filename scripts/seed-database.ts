import { supabaseAdmin as db } from '@/lib/supabase';

async function seed() {
  if (!db) {
    console.error('Supabase admin client not available');
    return;
  }
  
  // Simple one-category, one-product seed to bootstrap DB
  const { data: cat, error: e1 } = await db.from('categories').insert({ name: 'Sarees', slug: 'sarees', description: 'Seed category', image: 'https://picsum.photos/seed/category/600/400', is_active: true }).select('id').single();
  if (e1) { console.error('Category seed error', e1); return; }
  const categoryId = (cat?.id) as string;

  const { data: prod, error: e2 } = await db.from('products').insert({ name: 'Seed Product', description: 'Seed product for initial data', price: 999, category_id: categoryId, sku: 'SEED-001', inventory: 10, status: 'active' }).select('*').single();
  if (e2) { console.error('Product seed error', e2); return; }
  const productId = (prod?.id) as string;

  await db.from('product_images').insert({ product_id: productId, url: 'https://picsum.photos/seed/seed/600/400', alt: 'Seed image', order_index: 0, is_primary: true });
  await db.from('cultural_metadata').insert({ product_id: productId, occasions: ['wedding'], fabric: 'silk', work: 'embroidery', region: 'gujarat', care_instructions: [], color_family: [] });
  await db.from('product_sizes').insert({ product_id: productId, label: 'M', chest: 38, waist: 32, length: 40, available: true });

  console.log('Seed complete');
}

seed().catch((err) => { console.error(err); });
