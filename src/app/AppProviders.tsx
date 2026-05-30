import { ConfigProvider } from 'antd';
import { antdTheme } from '@/config/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider theme={{ ...antdTheme, hashed: true }}>
      {children}
    </ConfigProvider>
  );
}
