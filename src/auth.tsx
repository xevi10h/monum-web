'use client';
import { usePathname, useRouter } from '@/navigation';
import { useEffect } from 'react';

export default function requireAuth<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
) {
  const RequireAuth = (props: T) => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
      const userLocalStorage = localStorage.getItem('user');
      const state = userLocalStorage
        ? JSON.parse(userLocalStorage).state
        : null;
      const user = state ? state.user : null;
      const token = user ? user.token : null;
      if (!token) {
        router.push(`/login?redirect=${pathname}`);
      }
    });

    return <WrappedComponent {...props} />;
  };

  return RequireAuth;
}
