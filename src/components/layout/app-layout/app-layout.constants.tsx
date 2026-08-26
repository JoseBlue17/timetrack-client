import type { ReactNode } from 'react';
import { LuClock, LuClipboardList, LuCreditCard, LuHouse, LuSettings } from 'react-icons/lu';

import { UserRole } from '@/enums';
import { ROUTES } from '@/constants';

export interface INavItem {
  key: string;
  label: ReactNode;
  icon: ReactNode;
  roles: UserRole[];
}

export const ALL_NAV_ITEMS: INavItem[] = [
  {
    key: ROUTES.HOME,
    label: 'Dashboard',
    icon: <LuHouse className="text-black text-lg" />,
    roles: [UserRole.Employee, UserRole.Supervisor, UserRole.Admin],
  },
  {
    key: ROUTES.TIMESHEETS,
    label: 'Timesheets',
    icon: <LuClock className="text-black text-lg" />,
    roles: [UserRole.Employee],
  },
  {
    key: ROUTES.REPORTS,
    label: 'Reportes',
    icon: <LuClipboardList className="text-black text-lg" />,
    roles: [UserRole.Supervisor, UserRole.Admin],
  },
  {
    key: ROUTES.PAYMENTS,
    label: 'Pagos',
    icon: <LuCreditCard className="text-black text-lg" />,
    roles: [UserRole.Admin],
  },
  {
    key: ROUTES.SETTINGS,
    label: 'Settings',
    icon: <LuSettings className="text-black text-lg" />,
    roles: [UserRole.Employee, UserRole.Supervisor, UserRole.Admin],
  },
];
