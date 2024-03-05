import { montserrat } from '@/app/ui/fonts';
import Image from 'next/image';

export default function MonumIcon() {
  return (
    <div
      className={`${montserrat.className} flex flex-row items-center gap-3 leading-none`}
    >
      <Image
        src="/monum-icon.png"
        alt="Monum Icon"
        width={75}
        height={75}
        className="block"
      />
    </div>
  );
}
