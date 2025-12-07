import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug || product.id}`} className="block group">
      <div className="border rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800 hover:shadow-lg transition-shadow">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-700" />
        )}
        <div className="p-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:underline">
            {product.name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
