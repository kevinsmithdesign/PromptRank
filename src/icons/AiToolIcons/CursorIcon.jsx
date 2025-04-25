import React from "react";

const CursorIcon = () => {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="52" rx="8" fill="#222222" />
      <path d="M12.2188 18.125V33.875H39.7812V18.125L26 10.25" fill="#444444" />
      <path
        d="M26 26V10.25L12.2188 18.125L39.7812 33.875L26 41.75L12.2188 33.875"
        fill="#939393"
      />
      <path d="M39.7812 18.125H26V41.75" fill="#E3E3E3" />
      <path d="M12.2188 18.125H39.7812L26 26" fill="white" />
    </svg>
  );
};

export default CursorIcon;
