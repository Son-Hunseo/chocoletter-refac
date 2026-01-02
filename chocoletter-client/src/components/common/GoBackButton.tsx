type GoBackButtonProps = {
    strokeColor?: string; // 아이콘의 stroke 색상
    altText?: string; // 접근성 텍스트
    className?: string; // 추가 클래스
    onClick?: () => void; 
};

export const GoBackButton = ({
    strokeColor = "white", // 기본값은 white
    altText = "뒤로가기 버튼",
    className = "",
    onClick,    
}: GoBackButtonProps) => {
    const baseStyle = "absolute flex items-center justify-center mt-[17px] ml-4 top-0 left-0";

    const handleBackClick = () => {
        if (onClick) {
            onClick(); // 🟢 외부에서 전달된 `onClick` 실행
        }
        window.history.back(); // 🟢 항상 브라우저 뒤로 가기 실행
    };

    return (
        <button
            onClick={handleBackClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            {/* SVG 아이콘 */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M18 1L7 12.2683L17.4762 23"
                    stroke={strokeColor} // 동적으로 stroke 설정
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};
