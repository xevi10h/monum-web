import { useTranslations } from 'next-intl';
import React from 'react';

const Modal = ({
  title,
  message,
  closeClassName,
  confirmClassName,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  closeClassName: string;
  confirmClassName: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const t = useTranslations('MediaDelete');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-10 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-center text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-end">
          <button
            className={`mr-2 rounded px-4 py-2 ${closeClassName}`}
            onClick={onClose}
          >
            {t('cancel')}
          </button>
          <button
            className={`rounded px-4 py-2 text-white ${confirmClassName}`}
            onClick={onConfirm}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
