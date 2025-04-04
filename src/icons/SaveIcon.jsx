import React from "react";

const SaveIcon = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="Folder File Add Plus"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.9738 15.6546C20.9738 19.0094 18.9967 20.9874 15.6409 20.9874H8.34452C4.981 20.9874 3 19.0094 3 15.6546V8.34168C3 4.99079 4.23193 3.01367 7.58768 3.01367H9.46278C10.1361 3.01367 10.7695 3.33137 11.1737 3.86961L12.0296 5.00827C12.4348 5.54554 13.0682 5.86227 13.7415 5.86421H16.3948C19.7584 5.86421 21 7.57609 21 10.9989L20.9738 15.6546Z"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M14.2976 13.1954H9.70312M12.0016 15.4929V10.8984"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};

export default SaveIcon;
