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
      id="Eye 2"
      width="24"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 12.9672C3 16.5892 7.289 20.0692 12 20.0692C16.712 20.0692 21 16.5892 21 12.9672C21 9.34524 16.674 5.86523 12 5.86523C7.327 5.86523 3 9.34524 3 12.9672Z"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.0788 12.9657C15.0788 11.2667 13.7008 9.88867 12.0018 9.88867C10.3038 9.88867 8.92578 11.2667 8.92578 12.9657C8.92578 14.6637 10.3038 16.0417 12.0018 16.0417C13.7008 16.0417 15.0788 14.6637 15.0788 12.9657Z"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};

export default EyeIcon;
