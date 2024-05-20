'use client';
import MonumIcon from '@/app/[locale]/ui/monum-icon-white';
import LoginForm from '@/app/[locale]/ui/login-form';
import MonumLetters from '@/app/[locale]/ui/monum-letters';
import { useRouter } from '@/navigation';
import { useUserStore } from '@/zustand/UserStore';
import { LanguageToLocale } from '@/shared/types/Locale';

export default function LoginPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  if (user.token) {
    router.push('/dashboard', { locale: LanguageToLocale[user.language] });
  }
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
        <LoginForm />
      </div>
    </main>
  );
}
