import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-20 text-center ${className}`}
    >
      {icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
          {icon}
        </div>
      ) : null}
      <div>
        <p className="font-bold text-gray-800">{title}</p>
        {description ? <p className="text-sm text-gray-400">{description}</p> : null}
      </div>
    </div>
  );
}
