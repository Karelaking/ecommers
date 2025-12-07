"use client";
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton width={120} height={28} />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <Skeleton width={64} height={64} circle />
              <div className="flex-1 space-y-2">
                <Skeleton height={14} width="60%" />
                <Skeleton height={12} width="40%" />
              </div>
              <Skeleton width={60} height={16} />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Skeleton height={16} width="40%" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
