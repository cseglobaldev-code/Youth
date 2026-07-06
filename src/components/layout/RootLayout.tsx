import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { JoinModalProvider } from '@/components/common/JoinModal';

export function RootLayout() {
  useScrollToTop();

  return (
    <JoinModalProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Shared page background: white + decorative blur ellipses on every page */}
        <main className="flex-1 bg-white relative overflow-x-hidden">
          <div
            className="absolute top-0 left-0 w-[458px] h-[336px] rounded-full pointer-events-none"
            style={{ background: '#2980B9', filter: 'blur(600px)', opacity: 0.43 }}
          />
          <div
            className="absolute top-0 right-0 w-[570px] h-[205px] rounded-full pointer-events-none"
            style={{ background: '#EE334E', filter: 'blur(600px)', opacity: 0.43 }}
          />
          <Outlet />
        </main>
        <Footer />
      </div>
    </JoinModalProvider>
  );
}
