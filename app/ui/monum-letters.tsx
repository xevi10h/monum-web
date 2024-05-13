import Image from 'next/image';

export default function MonumLetters() {
  return (
    <div className={`flex flex-row items-center gap-3 leading-none`}>
      <Image
        src="/monum-letters-white.png"
        alt="Monum Letters White"
        width={267}
        height={50}
        className="block"
        priority
      />
    </div>
  );
}
