import React from 'react';

const Modal = ({
  title,
  message,
  closeColor,
  confirmColor,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  closeColor: string;
  confirmColor: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const colorClose = `bg-${closeColor}-300 hover:bg-${closeColor}-400`;
  const colorConfirm = `bg-${confirmColor}-500 hover:bg-${confirmColor}-600`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-10 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-center text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-end">
          <button
            className={`mr-2 rounded px-4 py-2 ${colorClose}`}
            onClick={onClose}
          >
            Cancel·lar
          </button>
          <button
            className={`rounded px-4 py-2 text-white ${colorConfirm}`}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
