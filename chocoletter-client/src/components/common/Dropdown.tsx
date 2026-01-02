import React, { useEffect, useRef } from "react";

interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	className?: string;
}

/**
 * 공통 드롭다운
 * - 열릴 때 wave-down 애니메이션 적용
 * - 바깥 클릭 시 닫기
 */
const Dropdown: React.FC<DropdownProps> = ({
	isOpen,
	onClose,
	children,
	className,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	// 바깥 클릭 감지
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			ref={dropdownRef}
			className={`
        absolute z-50
        bg-white shadow-md rounded-md
        wave-down
        ${className || ""}
      `}
		>
			{children}
		</div>
	);
};

export default Dropdown;
