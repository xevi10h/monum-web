'use client';
import SideNav from '@/app/[locale]/ui/dashboard/sidenav';
import { useGlobalStore } from '@/zustand/GlobalStore';
import SpinnerTop from '../ui/spinnerTop';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isLoading = useGlobalStore((state) => state.isLoading);
  return (
    <div>
      {isLoading && <SpinnerTop />}
      <div className="flex flex-col md:flex-row md:overflow-hidden">
        <div className="h-screen w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
