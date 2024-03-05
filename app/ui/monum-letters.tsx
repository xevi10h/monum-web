import { montserrat } from '@/app/ui/fonts';
import Image from 'next/image';

export default function MonumLetters() {
  return (
    <div
      className={`${montserrat.className} flex flex-row items-center gap-3 leading-none`}
    >
      <Image
        src="/monum-letters-white.png"
        alt="Monum Letters White"
        width={200}
        height={100}
        className="block"
      />
    </div>
  );
}
