import { useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router";
import { PurpleButton } from "../../common/PurpleButton";
import { disPreviewCoin } from "../../../services/giftBoxApi";
import { EmergeProblemModal } from "../../gift-list/modal/EmergeProblemModal";
import { availableGiftsAtom } from "../../../atoms/gift/giftAtoms";

interface CheckLetterUseButtonProps {
    onClick: () => void,
}

export const CheckLetterUseButton = ({ onClick }: CheckLetterUseButtonProps) => {
    const [isPropblemOpen, setIsProblemOpen] = useState(false);
    const [remainOpenCount, setRemainOpenCount] = useRecoilState(availableGiftsAtom)
    const navigate = useNavigate();
    const checkLetterClickHandler = async () => {
        try {
            const response = await disPreviewCoin();
            console.log("checkletter", response);

            // 전역 힌트 개수 줄임
            setRemainOpenCount((prev) => Math.max(prev - 1, 0))
            // 기존 모달 지우고
            onClick();
            // 편지함으로 이동
            // 이전에서 atom에 giftId는 기록해 두었음.
            navigate('/letter')
        } catch (err) {
            setIsProblemOpen(true);
            console.log("초콜릿 열기 오류 : ", err)
        };
    }

    const allModalCloseHandler = () => {
        setIsProblemOpen(false);
        onClick();
    }

    return(
        <>
            <EmergeProblemModal isOpen={isPropblemOpen} onClose={allModalCloseHandler} />
            <PurpleButton onClick={checkLetterClickHandler} className="text-white bg-chocoletterPurpleBold border border-black">
                사용하기
            </PurpleButton>
        </>
    )
}