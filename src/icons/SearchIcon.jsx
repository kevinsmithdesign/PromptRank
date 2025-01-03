import React from "react";

const SearchIcon = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="Search"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <title>Iconly/Light/Search</title>
      <g
        id="Iconly/Light/Search"
        stroke="none"
        stroke-width="1.5"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          id="Search"
          transform="translate(2.000000, 2.000000)"
          stroke={stroke}
          stroke-width="1.5"
        >
          <circle
            id="Ellipse_739"
            cx="9.76659044"
            cy="9.76659044"
            r="8.9885584"
          ></circle>
          <line
            x1="16.0183067"
            y1="16.4851259"
            x2="19.5423342"
            y2="20.0000001"
            id="Line_181"
          ></line>
        </g>
      </g>
    </svg>
  );
};

export default SearchIcon;