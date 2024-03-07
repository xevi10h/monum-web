import MonumIcon from '@/app/ui/monum-icon';
import LoginForm from '@/app/ui/login-form';
import MonumLetters from '@/app/ui/monum-letters';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-500 p-3 md:h-36">
          <div className="w-36 text-white md:w-36">
            <MonumIcon /> <MonumLetters />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
