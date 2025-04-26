import * as React from 'react';
const MonumRoutes = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    className={className}
  >
    <g stroke="currentColor" strokeWidth={2} clipPath="url(#a)">
      <path d="M15.6 3.6H5.444a4.4 4.4 0 0 0 0 8.8h8.98" />
      <path d="M8.4 20.4h10.527a4 4 0 0 0 0-8H9.96M20.4 6.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM3.6 23a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default MonumRoutes;
