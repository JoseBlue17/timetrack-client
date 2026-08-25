import { Tag, type TagProps } from 'antd';
import type { ReactNode } from 'react';

interface StatusTagProps {
  label: ReactNode;
  color: string;
  className?: string;
  variant?: TagProps['variant'];
  style?: React.CSSProperties;
}

export function StatusTag({
  label,
  color,
  className,
  variant = 'outlined',
  style,
}: StatusTagProps) {
  return (
    <Tag color={color} className={className} variant={variant} style={style}>
      {label}
    </Tag>
  );
}
