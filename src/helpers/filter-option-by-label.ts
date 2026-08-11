import type { DefaultOptionType } from 'antd/es/select';

export function filterOptionByLabel(input: string, option?: DefaultOptionType): boolean {
  return String(option?.label ?? '')
    .toLowerCase()
    .includes(input.toLowerCase());
}
