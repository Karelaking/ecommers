'use client';

import React from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import { useWishlistStore } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';

interface HeaderProps {
  className?: string;
  onCartOpen?: () => void;
  onSearch?: (query: string) => void;
}

export function Header({ className, onCartOpen, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { getTotalItems } = useCartStore();
  const { getItemCount } = useWishlistStore();
  const breadcrumbs = useBreadcrumbs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const cartItemCount = getTotalItems();
  const wishlistItemCount = getItemCount();

  return (
    <header className={cn('sticky top-0 z-50 bg-white dark:bg-black shadow-md', className)}>
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />
        
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              EthnicWear
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for sarees, kurtis, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <a href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="h-6 w-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </a>

            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            <a href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="h-6 w-6" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Navigation Menu */}
        <nav className={cn(
          'lg:block border-t border-gray-200',
          isMenuOpen ? 'block' : 'hidden lg:block'
        )}>
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 py-4 lg:py-0">
            <li>
              <Link href="/" className="block py-2 lg:py-4 hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li className="relative group">
              <button className="flex items-center py-2 lg:py-4 hover:text-primary transition-colors">
                Women
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <Link href="/products/women/sarees" className="block py-2 hover:text-primary">Sarees</Link>
                  <Link href="/products/women/salwar-kameez" className="block py-2 hover:text-primary">Salwar Kameez</Link>
                  <Link href="/products/women/lehengas" className="block py-2 hover:text-primary">Lehengas</Link>
                  <Link href="/products/women/kurtis" className="block py-2 hover:text-primary">Kurtis</Link>
                  <Link href="/products/women/gowns" className="block py-2 hover:text-primary">Gowns</Link>
                </div>
              </div>
            </li>
            <li className="relative group">
              <button className="flex items-center py-2 lg:py-4 hover:text-primary transition-colors">
                Men
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <Link href="/products/men/sherwanis" className="block py-2 hover:text-primary">Sherwanis</Link>
                  <Link href="/products/men/kurtas" className="block py-2 hover:text-primary">Kurtas</Link>
                  <Link href="/products/men/ethnic-jackets" className="block py-2 hover:text-primary">Ethnic Jackets</Link>
                  <Link href="/products/men/dhotis" className="block py-2 hover:text-primary">Dhotis</Link>
                </div>
              </div>
            </li>
            <li>
              <Link href="/products/kids" className="block py-2 lg:py-4 hover:text-primary transition-colors">
                Kids
              </Link>
            </li>
            <li>
              <a href="/collections/festive" className="block py-2 lg:py-4 hover:text-primary transition-colors">
                Festive Collection
              </a>
            </li>
            <li>
              <a href="/collections/wedding" className="block py-2 lg:py-4 hover:text-primary transition-colors">
                Wedding Collection
              </a>
            </li>
            <li>
              <a href="/offers" className="block py-2 lg:py-4 text-red-600 font-semibold hover:text-red-700 transition-colors">
                Offers
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}