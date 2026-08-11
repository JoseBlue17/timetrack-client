import type { ReactNode } from 'react';
import { Avatar, type AvatarProps } from 'antd';
import { getUserInitials } from '@/helpers/get-user-initials';

interface IUserAvatarProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  size?: AvatarProps['size'];
  className?: string;
  fallback?: ReactNode;
}

export function UserAvatar({
  firstName,
  lastName,
  avatarUrl,
  size,
  className,
  fallback = 'U',
}: IUserAvatarProps) {
  const initials = getUserInitials(firstName, lastName);

  return (
    <Avatar
      size={size}
      src={avatarUrl}
      className={`shrink-0 ${className ?? 'bg-indigo-100 text-indigo-600'}`}
    >
      {!avatarUrl && (initials || fallback)}
    </Avatar>
  );
}
