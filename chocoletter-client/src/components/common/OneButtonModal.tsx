import React, { useEffect } from "react";
import FocusLock from "react-focus-lock";
import { PurpleButton } from "./PurpleButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const OneButtonModal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
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
            className={`bg-white rounded-[20px] shadow-lg p-5 w-full max-w-md gap-6 text-center flex flex-col justify-center items-center ${
                className || ""
            }`}
            onClick={handleContentClick}
            >
                {children}
                <PurpleButton onClick={onClose} className="w-full text-white bg-chocoletterPurpleBold " >
                    내 선물상자로 가기
                </PurpleButton>
            </div>
        </FocusLock>
        </div>
    );
};
