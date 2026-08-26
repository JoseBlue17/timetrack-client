import { useMemo } from 'react';

import { useCurrentRole } from '@/hooks';
import { ALL_NAV_ITEMS } from './app-layout.constants';

export function useNavItems() {
  const currentRole = useCurrentRole();

  return useMemo(
    () => ALL_NAV_ITEMS.filter((item) => !currentRole || item.roles.includes(currentRole)),
    [currentRole],
  );
}
