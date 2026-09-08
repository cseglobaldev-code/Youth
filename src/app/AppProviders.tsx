import { ConfigProvider, App as AntdApp } from 'antd';
import { antdTheme } from '@/config/theme';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

function ThemedApp({ children }: AppProvidersProps) {
  const { antdLocale } = useLanguage();

  return (
    <ConfigProvider theme={{ ...antdTheme, hashed: true }} locale={antdLocale}>
      <AntdApp>
        {children}
      </AntdApp>
    </ConfigProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <ThemedApp>{children}</ThemedApp>
    </LanguageProvider>
  );
}