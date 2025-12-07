import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
export default function Home() {
  // Placeholder data; replace with real API calls later
  const featuredProducts = [
    {
      id: "1",
      name: "Silk Saree",
      price: 129.99,
      image: "https://picsum.photos/seed/saree1/300/300",
      slug: "silk-saree",
    },
    {
      id: "2",
      name: "Embroidered Lehenga",
      price: 189.99,
      image: "https://picsum.photos/seed/lehenga1/300/300",
      slug: "embroidered-lehenga",
    },
    {
      id: "3",
      name: "Cotton Kurti",
      price: 49.99,
      image: "https://picsum.photos/seed/kurti1/300/300",
      slug: "cotton-kurti",
    },
    {
      id: "4",
      name: "Designer Anarkali",
      price: 99.99,
      image: "https://picsum.photos/seed/anarkali1/300/300",
      slug: "designer-anarkali",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4">
            EthnicWear Store
          </h1>
          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
            Discover authentic ethnic wear with modern style. Curated
            collections for every occasion.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-50">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-zinc-100 dark:bg-zinc-900">
        <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-50">
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Sarees", "Lehengas", "Kurtis", "Accessories"].map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat.toLowerCase()}`}
              className="px-6 py-3 bg-white dark:bg-zinc-800 rounded-full font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center text-zinc-700 dark:text-zinc-300">
          <p className="text-sm">
            ✅ Free Shipping on Orders Over $75 | ✅ Easy Returns | ✅ 100%
            Authentic Products
          </p>
        </div>
      </section>

      {/* Demo Content (dev only) */}
      {/* {process.env.NODE_ENV === 'development' && <DemoContent />} */}
    </div>
  );
}
