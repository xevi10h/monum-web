'use client';

export default function Spinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="spinner-border inline-block h-16 w-16 animate-spin rounded-full border-8 border-transparent border-t-monum-green-default"
        role="status"
      />
    </div>
  );
}
