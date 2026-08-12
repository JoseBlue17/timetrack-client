import type { ReactNode } from 'react';
import { PageHeaderActions } from '@/components/page-header-actions';

interface IPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  children = <PageHeaderActions />,
}: IPageHeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-brand">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-white mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
