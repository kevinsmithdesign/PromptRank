import React from "react";

const LogoutIcon = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="Logout"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>Iconly/Light/Logout</title>
      <g
        id="Iconly/Light/Logout"
        stroke="none"
        stroke-width="1.5"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          id="Logout"
          transform="translate(2.000000, 2.000000)"
          stroke={stroke}
          stroke-width="1.5"
        >
          <path
            d="M13.016,5.3895 L13.016,4.4565 C13.016,2.4215 11.366,0.7715 9.331,0.7715 L4.456,0.7715 C2.422,0.7715 0.772,2.4215 0.772,4.4565 L0.772,15.5865 C0.772,17.6215 2.422,19.2715 4.456,19.2715 L9.341,19.2715 C11.37,19.2715 13.016,17.6265 13.016,15.5975 L13.016,14.6545"
            id="Stroke-1"
          ></path>
          <line
            x1="19.8095"
            y1="10.0214"
            x2="7.7685"
            y2="10.0214"
            id="Stroke-3"
          ></line>
          <polyline
            id="Stroke-5"
            points="16.8812 7.1063 19.8092 10.0213 16.8812 12.9373"
          ></polyline>
        </g>
      </g>
    </svg>
  );
};

export default LogoutIcon;
