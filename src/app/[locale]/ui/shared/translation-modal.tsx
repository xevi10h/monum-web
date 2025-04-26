import { Language } from '@/shared/types/Language';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { ArrowLongRightIcon } from '@heroicons/react/20/solid';

const TranslationModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: ({
    originSelectedLanguage,
    destinationSelectedLanguage,
    overwrite,
  }: {
    originSelectedLanguage: Language;
    destinationSelectedLanguage: Language[];
    overwrite: boolean;
  }) => void;
}) => {
  const t = useTranslations('TranslationModal');
  const languages = useTranslations('Languages');
  const locale = useLocale() as Locale;
  const [originSelectedLanguage, setOriginSelectedLanguage] = useState(
    LocaleToLanguage[locale],
  );
  const [destinationSelectedLanguage, setDestionationSelectedLanguage] =
    useState<Language[]>([]);
  const [overwrite, setOverwrite] = useState(false);

  const handleOriginLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setOriginSelectedLanguage(e.target.value as Language);
    setDestionationSelectedLanguage([]);
  };

  const handleDestinationLanguageChange = (languageSelected: Language) => {
    setDestionationSelectedLanguage((prevSelected) =>
      prevSelected.includes(languageSelected as Language)
        ? prevSelected.filter((v) => v !== languageSelected)
        : [...prevSelected, languageSelected as Language],
    );
  };

  const languagesOptions = [
    { value: 'ca_ES', label: languages('ca_ES') },
    { value: 'es_ES', label: languages('es_ES') },
    { value: 'en_US', label: languages('en_US') },
    { value: 'fr_FR', label: languages('fr_FR') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-10 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-center text-lg font-semibold">{t('title')}</h2>
        <p className="mb-4 text-center">{t('message')}</p>
        <div className="flex h-40 w-full flex-row items-center justify-center gap-4 text-center align-middle">
          <div
            className={`flex h-full w-96 items-center rounded-lg ${originSelectedLanguage ? 'bg-monum-green-selected' : 'bg-gray-200'}`}
          >
            <div className="w-full">
              <label
                htmlFor="title"
                className="mb-2 flex w-full flex-row justify-center  text-base font-normal"
              >
                {t('originLanguage')}
              </label>
              <select
                id="originLanguage"
                name="originLanguage"
                className="rounded-md border border-gray-200 py-2 pl-3 text-sm text-gray-700"
                value={originSelectedLanguage}
                onChange={handleOriginLanguageChange}
              >
                {languagesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ArrowLongRightIcon className="w-16" />
          <div
            className={`flex h-full w-96 items-center rounded-lg ${destinationSelectedLanguage.length > 0 ? 'bg-monum-green-selected' : 'bg-gray-200'}`}
          >
            <div className="w-full">
              <label
                htmlFor="title"
                className="mb-2 block text-base font-normal"
              >
                {t('destinationLanguages')}
              </label>
              {languagesOptions.map((option) => (
                <div key={option.value} className="px-28 ">
                  <label
                    className={`${originSelectedLanguage === option.value && 'text-gray-500'} block text-left`}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      style={{
                        color:
                          originSelectedLanguage === option.value
                            ? 'gray'
                            : 'blue',
                      }}
                      checked={
                        destinationSelectedLanguage.includes(
                          option.value as Language,
                        ) || originSelectedLanguage === option.value
                      }
                      disabled={originSelectedLanguage === option.value}
                      onChange={() =>
                        handleDestinationLanguageChange(
                          option.value as Language,
                        )
                      }
                      className={`mr-2  ${originSelectedLanguage === option.value ? 'checked:bg-gray-500' : 'checked:bg-blue-500'} `}
                    />
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <div className="flex w-96 flex-row items-center">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={() => setOverwrite(!overwrite)}
              className={`mr-2`}
            />
            <label>{t('overwrite')}</label>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            className={`mr-2 rounded bg-gray-300 px-4 py-2 hover:bg-gray-400`}
            onClick={onClose}
          >
            {t('cancel')}
          </button>
          <button
            disabled={
              destinationSelectedLanguage.length === 0 ||
              !originSelectedLanguage
            }
            className={`rounded ${
              destinationSelectedLanguage.length === 0 ||
              !originSelectedLanguage
                ? 'bg-gray-300 text-gray-500'
                : 'bg-monum-green-default text-white hover:bg-monum-green-hover'
            } px-4 py-2`}
            onClick={() =>
              onConfirm({
                originSelectedLanguage,
                destinationSelectedLanguage,
                overwrite,
              })
            }
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationModal;
