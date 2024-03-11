import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const requireAuth = <T extends {}>(WrappedComponent: React.ComponentType<T>) => {
  const RequireAuth = (props: T) => {
    const router = useRouter();
    const pathname = usePathname()
    useEffect(() => {
      const token = localStorage.getItem('monum_token');
      if (!token) {
        router.push(`/login?redirect=${pathname}`);
      }
    },);

    return <WrappedComponent {...props} />;
  };

  return RequireAuth;
};
