import React from "react";
import { useRecoilValue } from "recoil";
import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";
import { CheckLetterUseButton } from "../../gift-list-before/button/CheckLetterUseButton";
import { availableGiftsAtom } from "../../../atoms/gift/giftAtoms";
import readLetterIcon from "../../../assets/images/unboxing/letter_purple.svg"

interface IsOpenGeneralGiftModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const IsOpenGeneralGiftModal: React.FC<IsOpenGeneralGiftModalProps> = ({ isOpen, onClose }) => {
    const remainOpenCount = useRecoilValue(availableGiftsAtom)

    return (
        <OtherModal isOpen={isOpen} onClose={onClose} >
            <div className="text-center flex flex-col justify-center items-center gap-6 font-sans">
                <div className="w-7 h-7">
                    <img src={readLetterIcon} alt="편지 아이콘" className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-4">
                    <p>초콜릿을 열어 편지를 확인하시겠어요?<br/>열어볼 수 있는 초콜릿 수가 차감됩니다!</p>
                    <div className="h-7 px-[15px] py-[5px] bg-[#efe1ff] rounded-[18px] justify-center items-center gap-1 inline-flex">
                        <div className="text-center text-[#5800be] text-[13px] font-normal font-sans leading-[18.20px]">현재 열어볼 수 있는 초콜릿 : {remainOpenCount}개</div>
                    </div>
                </div>
                <div className="w-full flex justify-evenly">
                    <PurpleButton onClick={onClose} className="bg-white text-black border border-black">
                        아낄래요
                    </PurpleButton>
                    <CheckLetterUseButton onClick={onClose} />
                </div>
            </div>
        </OtherModal>
    )
}