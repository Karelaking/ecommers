import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  showNewsletter?: boolean;
}

export function Footer({ className, showNewsletter = true }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'Youtube', icon: Youtube, url: '#' },
  ];

  const customerServiceLinks = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping Information', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Care Instructions', href: '/care' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Blog', href: '/blog' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ];

  const categories = [
    { label: 'Women Sarees', href: '/products/women/sarees' },
    { label: 'Salwar Kameez', href: '/products/women/salwar-kameez' },
    { label: 'Lehengas', href: '/products/women/lehengas' },
    { label: 'Kurtis', href: '/products/women/kurtis' },
    { label: 'Men Sherwanis', href: '/products/men/sherwanis' },
    { label: 'Ethnic Wear', href: '/products/ethnic-wear' },
  ];

  return (
    <footer className={cn('bg-base-200 text-base-content', className)}>
      {/* Newsletter Section */}
      {showNewsletter && (
        <div className="bg-primary text-primary-content py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-6 opacity-90">
                Get exclusive offers, new arrivals, and style tips delivered to your inbox
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary-content"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-secondary text-secondary-content hover:bg-secondary/90"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">EthnicWear</h3>
            <p className="mb-6 text-base-content/80">
              Discover the finest collection of traditional and contemporary ethnic wear. 
              From timeless sarees to modern fusion outfits, we celebrate the rich heritage 
              of Indian fashion with authentic craftsmanship.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@ethnicwear.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Shop by Category</h4>
            <ul className="space-y-2">
              {categories.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base-content/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base-content/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 mb-6">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base-content/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base-content/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Payment */}
        <div className="border-t border-base-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">Follow Us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="p-2 bg-base-300 rounded-full hover:bg-primary hover:text-primary-content transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">We Accept:</span>
              <div className="flex gap-2">
                <img src="/payment/visa.png" alt="Visa" className="h-8" />
                <img src="/payment/mastercard.png" alt="Mastercard" className="h-8" />
                <img src="/payment/rupay.png" alt="RuPay" className="h-8" />
                <img src="/payment/upi.png" alt="UPI" className="h-8" />
                <img src="/payment/cod.png" alt="Cash on Delivery" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-base-300 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-base-content/60">
            <p>&copy; {currentYear} EthnicWear. All rights reserved.</p>
            <p className="mt-2">
              Made with ❤️ in India | Celebrating Traditional Indian Fashion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}