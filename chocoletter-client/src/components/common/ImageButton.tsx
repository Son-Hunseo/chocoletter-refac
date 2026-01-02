import React from "react";

type ImageButtonProps = {
  ref?: React.Ref<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  onLoad?: () => void;
  children?: React.ReactNode;
  className?: string;
  src?: string; // 이미지 소스
  alt?: string; // 이미지 대체 텍스트
};

const ImageButton = ({
  type = "button",
  onClick,
  onLoad,
  children,
  className = "",
  src = "",
  alt = "button image",
}: ImageButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} p-0 border-0`} // 패딩과 테두리 제거
    >
      <img
        src={src}
        alt={alt}
        className="display-block"
        onLoad={() => {
          console.log(`Image Loaded: ${src}`); // ✅ 디버깅용 로그
          if (onLoad) onLoad();
        }}
      />
      {children}
    </button>
  );
};

export { ImageButton };
