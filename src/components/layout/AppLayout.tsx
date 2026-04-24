import SideNav from './SideNav';
import TopNav from './TopNav';
import AppFooter from './AppFooter';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased flex overflow-hidden min-h-screen">
      <SideNav />
      <main className="flex-1 ml-64 bg-surface-container-low pb-6 min-h-screen">
        <TopNav />
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
          <AppFooter />
        </div>
      </main>
    </div>
  );
}
