"use client";
import React from 'react';

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
};

export function Skeleton({ width = '100%', height = 16, className = '', circle = false }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };
  return (
    <div
      className={`bg-gray-200 rounded ${circle ? 'rounded-full' : 'rounded'} animate-pulse ${className}`}
      style={style}
    />
  );
}
