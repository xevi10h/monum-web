'use client';

import { montserrat } from '@/app/[locale]/fonts';
import requireAuth from '@/auth';
import IUser from '@/shared/interfaces/IUser';
import { useUserStore } from '@/zustand/UserStore';
import { VariablesOf, graphql } from '@/graphql';
import Image from 'next/image';
import { useRouter, usePathname } from '@/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/app/[locale]/ui/button';
import { Language } from '@/shared/types/Language';
import IPermission from '@/shared/interfaces/IPermission';
import Spinner from '@/app/[locale]/ui/spinner';
import { LanguageToLocale, Locale } from '@/shared/types/Locale';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleToDateTimeFormat } from '@/shared/types/DateTimeFormat';

const UpdateUserMutation = graphql(`
  mutation Mutation($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
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

function SettingsPage() {
  const t = useTranslations('Settings');
  const languages = useTranslations('Languages');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.getUser());
  const deleteUser = useUserStore((state) => state.deleteUser);
  const setUser = useUserStore((state) => state.setUser);
  const [newProvisionalPhoto, setNewProvisionalPhoto] = useState<string | null>(
    null,
  );
  const [updatePlace, { loading, error }] = useMutation(UpdateUserMutation, {
    onError: (error) => console.error('Update place error', error),
    onCompleted: (data) => {
      const userData = data.updateUser;
      if (userData?.token) {
        const user: IUser = {
          ...userData,
          id: userData.id,
          email: userData.email || undefined,
          username: userData.username || undefined,
          name: userData.name || undefined,
          photo: userData.photo || undefined,
          googleId: userData.googleId || undefined,
          language: (userData.language || 'en_US') as Language,
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
        router.replace(pathname, { locale: LanguageToLocale[user.language] });
      } else {
        console.log('Failed updating place', data);
      }
    },
    update: (cache) => {
      cache.evict({
        id: cache.identify({ __typename: 'User', id: user.id }),
      });
      cache.evict({ fieldName: 'LoginMutation' });
      cache.gc();
    },
  });
  const dateFormater = new Intl.DateTimeFormat(LocaleToDateTimeFormat[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProvisionalPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const variables: VariablesOf<typeof UpdateUserMutation> = {
        updateUserInput: {
          email: formData.get('email') as string,
          id: user.id,
          language: formData.get('language') as string,
          photoBase64: newProvisionalPhoto,
          name: formData.get('name') as string,
          username: formData.get('username') as string,
        },
      };
      await updatePlace({ variables });
    } catch (error) {
      console.error('Update place error', error);
    }
  };

  const photoToShow = newProvisionalPhoto || user.photo;

  return loading ? (
    <Spinner />
  ) : (
    <div className={`w-full ${montserrat.className}`}>
      <div className="mb-10 flex w-full">
        <h1 className={`text-2xl`}>{t('title')}</h1>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <h2 className="block text-xl font-semibold">{t('profile')}</h2>
        <h3 className="mb-8 text-sm ">{t('updateProfile')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <div className="h-48 w-2/3">
              <div className="space-between  flex h-10 w-full flex-row items-center">
                <label htmlFor="name" className="mr-6 w-1/6 text-right text-sm">
                  {t('completeName')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="string"
                  defaultValue={user.name}
                  placeholder={t('completeName')}
                  className="w-5/6 rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500"
                />
              </div>
              <div className="space-between flex h-10 w-full flex-row items-center">
                <label htmlFor="name" className="mr-6 w-1/6 text-right text-sm">
                  {t('username')}
                </label>
                <input
                  id="username"
                  name="username"
                  type="string"
                  defaultValue={user.username}
                  placeholder={t('username')}
                  className="w-5/6 rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500"
                />
              </div>
              <div className="space-between flex h-10 w-full flex-row items-center">
                <label htmlFor="name" className="mr-6 w-1/6 text-right text-sm">
                  {t('email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="string"
                  defaultValue={user.email}
                  placeholder={t('email')}
                  className="w-5/6 rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500"
                />
              </div>
              <div className="space-between flex h-10 w-full flex-row items-center">
                <label htmlFor="name" className="mr-6 w-1/6 text-right text-sm">
                  {t('createdAt')}
                </label>
                <div className="py-2 text-sm ">
                  {typeof user.createdAt === 'string'
                    ? dateFormater.format(new Date(user.createdAt))
                    : dateFormater.format(user.createdAt)}
                </div>
              </div>
              <div className="space-between flex h-10 w-full flex-row items-center">
                <label htmlFor="name" className="mr-6 w-1/6 text-right text-sm">
                  {t('language')}
                </label>
                <select
                  id="language"
                  name="language"
                  className="w-5/6 rounded-md border border-gray-200 py-2 pl-3 text-sm text-gray-700"
                  defaultValue={user.language}
                >
                  <option value="ca_ES">{languages('ca_ES')}</option>
                  <option value="es_ES">{languages('es_ES')}</option>
                  <option value="en_US">{languages('en_US')}</option>
                  <option value="fr_FR">{languages('fr_FR')}</option>
                </select>
              </div>
            </div>
            <div className="flex w-1/3 flex-col items-center gap-4">
              <div className="group relative">
                {photoToShow ? (
                  <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500">
                    <Image
                      src={photoToShow}
                      alt={`Profile photo ${user.username}`}
                      className="h-44 w-44 object-cover"
                      width={176}
                      height={176}
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-4xl text-white">+</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    {t('noPhoto')}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-4xl text-white">+</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="absolute inset-0 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
          <div className="-mx-4 my-6 md:-mx-6">
            <div className="border-t border-gray-300"></div>
          </div>
          <div className="mt-6 flex justify-between gap-4">
            <button className="flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white">
              {t('save')}
            </button>
            <button
              className="flex h-10 items-center rounded-lg border-2 border-monum-red-default bg-white px-4 text-sm font-medium text-monum-red-default"
              onClick={(e) => {
                e.preventDefault();
                deleteUser();
                router.push('/');
              }}
            >
              {t('logout')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default requireAuth(SettingsPage);
