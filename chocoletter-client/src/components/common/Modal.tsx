import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import FocusLock from "react-focus-lock";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 콘텐츠 클릭 시 백드롭 클릭 이벤트 방지
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <FocusLock>
        <div
          className={`bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md ${
            className || ""
          }`}
          onClick={handleContentClick}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="모달 닫기"
          >
            <FaXmark className="text-gray-500 text-opacity-50 hover:text-gray-200" size={24} />
          </button>
          {children}
        </div>
      </FocusLock>
    </div>
  );
};

export default Modal;
