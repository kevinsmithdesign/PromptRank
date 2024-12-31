import React from "react";

const EditIcon = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <title>Delete Icon</title>
      <g stroke="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g
          transform="translate(3.000000, 3.000000)"
          stroke={stroke}
          strokeWidth={strokeWidth}
        >
          <line x1="10.747" y1="17.443" x2="18" y2="17.443"></line>
          <path d="M9.78,0.795 C10.556,-0.132 11.95,-0.268 12.896,0.492 C12.949,0.533 14.629,1.839 14.629,1.839 C15.669,2.467 15.992,3.803 15.349,4.823 C15.315,4.877 5.812,16.764 5.812,16.764 C5.496,17.159 5.016,17.392 4.503,17.397 L0.864,17.443 L0.044,13.972 C-0.071,13.484 0.044,12.972 0.36,12.577 L9.78,0.795 Z"></path>
          <line x1="8.021" y1="3.001" x2="13.473" y2="7.188"></line>
        </g>
      </g>
    </svg>
  );
};

export default EditIcon;
