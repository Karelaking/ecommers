"use client";
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Skeleton width="100%" height={420} />
        <div className="space-y-4">
          <Skeleton height={20} width="60%" />
          <Skeleton height={20} width="40%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="70%" />
        </div>
      </div>
    </div>
  );
}
