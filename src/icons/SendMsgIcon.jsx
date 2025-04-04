import React from "react";

const SendMsgIcon = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="Telegram 2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.8418 12.6394L8.64155 13.1852L16.1306 19.5914C16.6843 20.146 17.632 19.8726 17.8061 19.1088L20.9761 5.23204C21.1405 4.513 20.4264 3.90683 19.7433 4.18705L3.59856 10.7936C2.68297 11.1682 2.86006 12.5149 3.8418 12.6394Z"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M12.0704 16.34L10.1867 17.9483C9.77318 18.3015 9.13198 18.0807 9.02398 17.5475L8.64062 13.1875"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M8.64258 13.1853L20.6784 4.33594"
        stroke={stroke}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};

export default SendMsgIcon;
