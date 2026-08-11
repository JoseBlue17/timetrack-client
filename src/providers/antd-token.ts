import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#261f38',
    colorPrimaryHover: '#3a3050',
    colorPrimaryActive: '#1e192c',
    colorPrimaryBg: '#f0eff2',
    colorPrimaryBgHover: '#e6e4ea',
    colorPrimaryBorder: '#d1cfd6',
    colorPrimaryBorderHover: '#a9a4b0',
    colorPrimaryTextHover: '#3a3050',
    colorPrimaryText: '#261f38',
    colorPrimaryTextActive: '#1e192c',

    colorBgLayout: '#f5f5f5',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',

    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',

    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    fontFamily: '"Hoefler Text", Baskerville, Georgia, serif',
    fontSize: 14,
    fontSizeLG: 16,

    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      borderRadius: 8,
      borderRadiusLG: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 8,
      borderRadiusLG: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      fontFamily: '"Hoefler Text", Baskerville, Georgia, serif',
    },
    InputNumber: {
      borderRadius: 8,
      controlHeight: 40,
      fontFamily: '"Hoefler Text", Baskerville, Georgia, serif',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      fontFamily: '"Hoefler Text", Baskerville, Georgia, serif',
    },
    DatePicker: {
      borderRadius: 8,
      controlHeight: 40,
      fontFamily: '"Hoefler Text", Baskerville, Georgia, serif',
    },
    Tabs: {
      inkBarColor: '#261f38',
      itemSelectedColor: '#261f38',
      itemHoverColor: '#3a3050',
      itemActiveColor: '#1e192c',
    },
  },
};
