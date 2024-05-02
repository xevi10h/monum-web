import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-default active:bg-monum-green-default aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}
