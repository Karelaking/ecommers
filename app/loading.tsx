"use client";
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto space-y-4">
        <Skeleton height={22} width="40%" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton height={180} width="100%" />
              <Skeleton height={14} width={90 + (i % 3) * 5 + '%'} />
              <Skeleton height={14} width={60 + (i % 2) * 10 + '%'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
