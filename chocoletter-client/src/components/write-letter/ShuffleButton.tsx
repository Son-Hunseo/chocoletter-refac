import React from "react";
import shuffle_icon from "../../assets/images/letter/shuffle_icon.svg";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { RiResetRightFill } from "react-icons/ri";
import { AiOutlineReload } from "react-icons/ai";

type ShuffleButtonProps = {
    onShuffleClick: () => void; // 부모 컴포넌트로 전달할 이벤트
    className?: string; 
    altText?: string; 
};

export const ShuffleButton = ({
    onShuffleClick,
    className = "",
    altText = "질문 섞기 버튼",
}: ShuffleButtonProps) => {
    const baseStyle =
        "flex w-[60px] h-[45px] justify-center items-center gap-2 rounded-[15px] border border-black bg-[#9E4AFF]";
    
    return (
        <button
            onClick={onShuffleClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            <RiResetRightFill color="white" size={28}/>
        </button>
    );
};
