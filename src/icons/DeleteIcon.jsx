import React from "react";

const DeleteIcon = ({
  width = 24,
  height = 24,
  stroke = "#ff4444",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="remove circle"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 12C21 7.02908 16.9709 3 12 3C7.02908 3 3 7.02908 3 12C3 16.9699 7.02908 21 12 21C16.9709 21 21 16.9699 21 12Z"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M14.3304 9.66646L9.66792 14.329M14.3363 14.3353L9.66602 9.66504"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};

export default DeleteIcon;
