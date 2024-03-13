import MonumIcon from '@/app/ui/monum-icon';
import LoginForm from '@/app/ui/login-form';
import MonumLetters from '@/app/ui/monum-letters';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="h-30 flex gap-3 rounded-lg bg-green-500 p-5">
          <MonumIcon /> <MonumLetters />
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
