import React from "react";

const LikeIcon = ({
  width = 16,
  height = 16,
  stroke = "#fff",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      id="heart like"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.4851 6.97604C20.8041 5.29504 19.4911 4.07004 17.7901 3.52404C16.8611 3.22204 15.8541 3.15304 14.8791 3.31704C13.9861 3.46604 13.1771 4.00104 12.4971 4.49804C11.8411 4.02204 11.0121 3.47804 10.1151 3.32704C9.14806 3.16304 8.14306 3.23104 7.20606 3.52404C3.47606 4.73104 2.32706 8.81304 3.37006 12.058C4.99406 17.27 11.9891 20.583 12.2861 20.722C12.3531 20.753 12.4251 20.769 12.4981 20.769C12.5691 20.769 12.6421 20.753 12.7091 20.722C13.0011 20.586 19.8931 17.33 21.6141 12.065C21.6141 12.064 21.6141 12.063 21.6151 12.063C22.1661 10.347 22.1191 8.54004 21.4851 6.97604Z"
        fill={stroke}
      ></path>
    </svg>
  );
};

export default LikeIcon;
