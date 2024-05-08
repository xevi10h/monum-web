import Image from 'next/image';

export default function MonumMap() {
  return (
    <Image
      src="/monum-map.png"
      alt="Monum Map"
      width={24}
      height={24}
      className="block"
    />
  );
}
