import { Button, Tooltip } from 'antd';
import { LuBell, LuLogOut } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { useAuth, useLoggedUser } from '@/hooks';
import { UserAvatar } from '@/components/user-avatar';

export function PageHeaderActions() {
  const { loggedUser } = useLoggedUser();
  const { onLogout } = useAuth();
  const navigate = useNavigate();

  const firstName = loggedUser?.profile?.firstName ?? '';
  const lastName = loggedUser?.profile?.lastName ?? '';

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
      <Tooltip title="Perfil">
        <span onClick={() => navigate('/settings')} className="inline-flex cursor-pointer">
          <UserAvatar
            firstName={firstName}
            lastName={lastName}
            avatarUrl={loggedUser?.profile?.avatarUrl}
            className="bg-indigo-100 text-indigo-600"
          />
        </span>
      </Tooltip>
    </div>
  );
}
