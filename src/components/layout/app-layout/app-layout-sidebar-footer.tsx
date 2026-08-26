import { Button } from 'antd';
import { LuLogOut } from 'react-icons/lu';

import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/tools/cn';

interface IAppLayoutSidebarFooterProps {
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  onLogout: () => void;
}

export function AppLayoutSidebarFooter({
  firstName,
  lastName,
  fullName,
  role,
  avatarUrl,
  onLogout,
}: IAppLayoutSidebarFooterProps) {
  return (
    <div className="px-4 py-5 border-t border-gray-200 mt-auto">
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
        <div className="min-w-0">
          <p className="text-black text-sm font-semibold truncate">{fullName}</p>
          <p className={cn('text-gray-500 text-xs truncate capitalize')}>{role}</p>
        </div>
      </div>
      <Button
        icon={<LuLogOut />}
        onClick={onLogout}
        aria-label="Cerrar sesión"
        className={cn(
          'w-full bg-gray-50! hover:bg-red-50! hover:border-red-200! hover:text-red-600!',
        )}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
