import React from 'react';

const ChevronDown = ({ color = "#fff", size = 24, ...props }) => (
  <svg
    id="Chevron Down"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19 9L12 16L5 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronDown;
