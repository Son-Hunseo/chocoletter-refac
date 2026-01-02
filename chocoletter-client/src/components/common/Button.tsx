import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const Button = ({ type = "button", onClick, children, className = "" }: ButtonProps) => {
  const baseStyle = "px-4 py-3 text-black rounded-lg shadow-md hover:bg-chocoletterPurple";

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
};

export { Button };
