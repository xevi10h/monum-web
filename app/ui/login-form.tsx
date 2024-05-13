'use client';

import { montserrat } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginMutation = graphql(`
  mutation Mutation($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      token
    }
  }
`);

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { loading, error }] = useMutation(LoginMutation, {
    onError: (error) => console.error('Login error:', error),
    onCompleted: (data) => {
      if (data.loginUser?.token) {
        localStorage.setItem('monum_token', data.loginUser.token);
        console.log('Login successful', data);
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
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
          Entra les teves credencials per continuar.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Correu electrònic
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Entra el teu correu electrònic"
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
              Contrasenya
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Entra la teva contrasenya"
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
          Accedir <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
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
