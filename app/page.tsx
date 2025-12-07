'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { HERO_IMAGES } from "@/lib/config/images";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [HERO_IMAGES.primary, HERO_IMAGES.secondary, HERO_IMAGES.tertiary];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);
  // Placeholder data; replace with real API calls later
  const featuredProducts = [
    {
      id: "1",
      name: "Silk Saree",
      price: 129.99,
      image: "https://images.cbazaar.com/pl_images/bannerimages/MSB2_Oct23.jpg",
      slug: "silk-saree",
    },
    {
      id: "2",
      name: "Embroidered Lehenga",
      price: 189.99,
      image: "https://images.cbazaar.com/pl_images/bannerimages/MSB1_Oct23.jpg",
      slug: "embroidered-lehenga",
    },
    {
      id: "3",
      name: "Cotton Kurti",
      price: 49.99,
      image: "https://images.cbazaar.com/pl_images/bannerimages/MSB4_Oct23.jpg",
      slug: "cotton-kurti",
    },
    {
      id: "4",
      name: "Designer Anarkali",
      price: 99.99,
      image: "https://images.cbazaar.com/pl_images/bannerimages/MSB6_Oct23.jpg",
      slug: "designer-anarkali",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Images with Crossfade */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 hero-image-transition ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Ethnic wear collection ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        
        {/* Animated Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 dark:from-black/80 dark:via-black/60 dark:to-black/80" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg animate-fade-in-up">
            EthnicWear Store
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow animate-fade-in-up animation-delay-200">
            Discover authentic ethnic wear with modern style. Curated
            collections for every occasion.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-primary-gold text-zinc-900 font-semibold rounded-full hover:bg-primary-red transition-all duration-300 transform hover:scale-105 hover:shadow-2xl drop-shadow-lg animate-fade-in-up animation-delay-400"
          >
            Shop Now
          </Link>
        </div>
        
        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20 hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
