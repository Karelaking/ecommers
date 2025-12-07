'use client';

import { usePathname } from 'next/navigation';
import { getBreadcrumbs } from '@/lib/breadcrumb-utils';
import { BreadcrumbItem } from '@/components/layout/breadcrumb';

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  return getBreadcrumbs(pathname);
}