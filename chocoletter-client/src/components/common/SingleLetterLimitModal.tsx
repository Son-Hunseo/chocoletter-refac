import React from "react";
import { useRecoilValue } from "recoil";
import { OtherModal } from "./OtherModal";
import { PurpleButton } from "./PurpleButton";
import { availableGiftsAtom } from "../../atoms/gift/giftAtoms";
import readLetterIcon from "../../assets/images/unboxing/letter_purple.svg";

interface SingleLetterLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: () => void; // 보내기 동작 추가
}

export const SingleLetterLimitModal: React.FC<SingleLetterLimitModalProps> = ({ isOpen, onClose, onSend }) => {
    const remainOpenCount = useRecoilValue(availableGiftsAtom);

    return (
        <OtherModal isOpen={isOpen} onClose={onClose}>
            <div className="text-center flex flex-col justify-center items-center gap-6">
                <div className="w-7 h-7">
                    <img src={readLetterIcon} alt="편지 아이콘" className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-4">
                    <p>한 사람에게 단 하나의 편지만 보낼 수 있어요! <br/> 이 내용으로 보내시겠어요?</p>
                </div>
                <div className="w-full flex justify-evenly">
                    <PurpleButton onClick={onClose} className="w-[90px] bg-white text-black border border-black hover:bg-chocoletterGiftBoxBg">
                        수정하기
                    </PurpleButton>
                    <PurpleButton onClick={onSend} className="w-[90px] bg-chocoletterPurpleBold text-white border border-black hover:bg-chocoletterGiftBoxBg">
                        다음으로
                    </PurpleButton>
                </div>
            </div>
        </OtherModal>
    );
};
