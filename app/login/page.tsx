import MonumIcon from '@/app/ui/monum-icon-white';
import LoginForm from '@/app/ui/login-form';
import MonumLetters from '@/app/ui/monum-letters';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen ">
      <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 rounded-lg border-2  border-monum-green-dark  md:-mt-32">
        <div
          className="h-30 align-items-center flex shrink-0 justify-center gap-3  bg-monum-green-dark  py-10"
          style={{
            backgroundImage: 'url(/background_monums_horizontal.png)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            width: '100%',
            minHeight: '150px',
          }}
        >
          <MonumIcon /> <MonumLetters />
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
