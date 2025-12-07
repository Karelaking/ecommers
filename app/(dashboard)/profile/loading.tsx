"use client";
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton width={56} height={56} circle />
          <div className="flex-1 space-y-2">
            <Skeleton height={20} width={240} />
            <Skeleton height={12} width={180} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton height={16} width="60%" />
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="70%" />
          </div>
          <div className="space-y-4">
            <Skeleton height={16} width="60%" />
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="70%" />
          </div>
        </div>
      </div>
    </div>
  );
}
