import { Avatar, Button } from 'antd';
import { LuBell, LuLogOut } from 'react-icons/lu';

import { useAuth, useLoggedUser } from '@/hooks';

export function PageHeaderActions() {
  const { loggedUser } = useLoggedUser();
  const { onLogout } = useAuth();

  const firstName = loggedUser?.profile?.firstName ?? '';
  const lastName = loggedUser?.profile?.lastName ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <Button
        shape="circle"
        icon={<LuBell />}
        className="border-none shadow-none bg-gray-50 hover:bg-gray-100!"
      />
      <Button
        shape="circle"
        icon={<LuLogOut />}
        onClick={onLogout}
        className="border-none shadow-none bg-gray-50 hover:bg-red-50! hover:text-red-600!"
      />
      <Avatar className="shrink-0 bg-indigo-100! text-indigo-600!">{initials || 'U'}</Avatar>
    </div>
  );
}
