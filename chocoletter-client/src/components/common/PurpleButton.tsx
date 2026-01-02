import React from "react";

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
};

export const PurpleButton = ({ type = "button", onClick, children, className = "" }: ButtonProps) => {
    const baseStyle = "px-4 py-3 font-sans rounded-[15px] shadow-md hover:bg-black/40 outline-none focus:ring-0";

    return (
        <button type={type} onClick={onClick} className={`${baseStyle} ${className}`}>
        {children}
        </button>
    );
};
