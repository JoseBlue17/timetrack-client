import { Spin } from 'antd';
import type { ReactNode } from 'react';

interface LoadingBoxProps {
  text?: string;
  className?: string;
  icon?: ReactNode;
}

export function LoadingBox({
  text = 'Cargando...',
  className = '',
  icon = <Spin size="large" />,
}: LoadingBoxProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-20 ${className}`}>
      {icon}
      <p className="text-gray-400 animate-pulse font-medium">{text}</p>
    </div>
  );
}
