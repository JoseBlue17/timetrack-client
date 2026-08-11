import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

import { themeConfig } from './antd-token';

export function AntDProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
