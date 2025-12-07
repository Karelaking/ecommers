'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600 py-3 px-4 bg-gray-50 border-b border-gray-200",
        className
      )}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
            )}
            
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-primary transition-colors",
                  item.isActive 
                    ? "text-primary font-medium" 
                    : "text-gray-600"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                item.isActive ? "text-primary font-medium" : "text-gray-600"
              )}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}