import * as React from 'react';
const MonumMap = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    className={className}
  >
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.05 23H6.5m11.55 0H23l-1.074-4.807M18.05 23l-2.017-12.283m-7.7 0L6.5 23m-3.351-9.614L4 9.576h3.5m-4.351 3.81h6.834m-6.834 0-1.075 4.807m12.31-4.807h6.467m0 0L20 9.576h-3.5m4.351 3.81 1.075 4.807m-19.852 0L1 23h5.5m-4.426-4.807h19.852"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M6.966 6.211A5.186 5.186 0 0 1 12.186 1c2.9 0 5.22 2.303 5.22 5.211 0 3.636-4.407 9.331-5.22 9.331-.812 0-5.22-5.695-5.22-9.331Z"
    />
  </svg>
);
export default MonumMap;
