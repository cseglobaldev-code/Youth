import type { ThemeConfig } from 'antd';
import { tokens } from './tokens';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.colors.brand.DEFAULT,
    colorInfo: tokens.colors.brand.DEFAULT,
    borderRadius: 8,
    fontFamily: tokens.fontFamily.sans.join(', '),
  },
  components: {
    Tabs: {
      itemActiveColor: tokens.colors.brand.DEFAULT,
      itemSelectedColor: tokens.colors.brand.DEFAULT,
      inkBarColor: tokens.colors.brand.DEFAULT,
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
    },
    Pagination: {
      colorPrimary: tokens.colors.brand.DEFAULT,
    },
    Drawer: {
      colorBgElevated: '#FFFFFF',
    },
  },
};
