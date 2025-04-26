import Image from 'next/image';

export default function MonumIcon() {
  return (
    <div className={`flex flex-row items-center gap-3 leading-none`}>
      <Image
        src="/monum-icon-white.png"
        alt="Monum Icon"
        width={50}
        height={50}
        className="block"
      />
    </div>
  );
}
