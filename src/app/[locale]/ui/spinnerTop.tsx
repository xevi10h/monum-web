'use client';

export default function SpinnerTop() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="spinner-border inline-block h-16 w-16 animate-spin rounded-full border-8 border-transparent border-t-monum-green-default"
        role="status"
      />
    </div>
  );
}
