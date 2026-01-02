import React from "react";

interface BackdropProps {
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      aria-hidden="true"
    ></div>
  );
};

export default Backdrop;
