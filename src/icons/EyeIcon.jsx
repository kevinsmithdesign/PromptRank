import React from "react";

const EyeIcon = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="Eye"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.998 19C15.703 19 19.092 16.3746 21 12C19.092 7.62537 15.703 5 11.998 5C8.297 5 4.908 7.62537 3 12C4.908 16.3766 8.297 19 12.002 19H11.998Z"
        stroke="#fff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.0788 12.0052C15.0788 13.6785 13.7008 15.0366 12.0028 15.0366C10.3038 15.0366 8.92578 13.6785 8.92578 12.0052C8.92578 10.3308 10.3038 8.97278 12.0028 8.97278C13.7008 8.97278 15.0788 10.3308 15.0788 12.0052Z"
        stroke="#fff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};

export default EyeIcon;
