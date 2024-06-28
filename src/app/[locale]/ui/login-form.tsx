'use client';

import { montserrat } from '@/app/[locale]/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/[locale]/ui/button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useUserStore } from '@/zustand/UserStore';
import IUser from '@/shared/interfaces/IUser';
import { Language } from '@/shared/types/Language';
import IPermission from '@/shared/interfaces/IPermission';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageToLocale } from '@/shared/types/Locale';
import { useEffect } from 'react';

const LoginMutation = graphql(`
  mutation Mutation($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      id
      email
      username
      createdAt
      updatedAt
      googleId
      token
      name
      language
      photo
      hasPassword
      roleId
      permissions {
        action
        entity
        max
        min
        name
        description
      }
    }
  }
`);

export default function LoginForm() {
  const t = useTranslations('Login');
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { loading, error }] = useMutation(LoginMutation, {
    onError: (error) => console.error('Login error:', error),
    onCompleted: (data) => {
      const userData = data.loginUser;
      if (userData?.token) {
        const user: IUser = {
          ...userData,
          id: userData.id,
          email: userData.email || undefined,
          username: userData.username || undefined,
          name: userData.name || undefined,
          photo: userData.photo || undefined,
          googleId: userData.googleId || undefined,
          language: userData.language as Language,
          hasPassword: userData.hasPassword || false,
          permissions: (userData.permissions || []) as IPermission[],
          token: userData.token,
          createdAt: userData.createdAt
            ? new Date(userData.createdAt)
            : new Date(),
          updatedAt: userData.updatedAt
            ? new Date(userData.updatedAt)
            : new Date(),
        };
        setUser(user);
        const redirect = searchParams?.get('redirect') || '/dashboard/home';
        router.push(redirect, { locale: LanguageToLocale[user.language] });
      } else {
        console.log('Login failed', data);
      }
    },
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const variables: VariablesOf<typeof LoginMutation> = {
        loginInput: {
          emailOrUsername: e.target.email.value,
          password: e.target.password.value,
        },
      };
      await login({ variables });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 ">
      <div className="flex-1 rounded-lg  bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${montserrat.className} mb-3 text-2xl`}>
          {t('title')}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {t('email')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder={t('emailPlaceholder')}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {t('password')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={t('passwordPlaceholder')}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          disabled={loading}
          aria-disabled={loading}
        >
          {t('login')}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        {error && (
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error.message}</p>
            </>
          </div>
        )}
      </div>
    </form>
  );
}
