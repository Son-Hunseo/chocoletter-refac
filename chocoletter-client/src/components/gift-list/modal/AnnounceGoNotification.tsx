import React, { useEffect, useState } from "react";
import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface AnnounceGoNotificationModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export const AnnounceGoNotificationModal: React.FC<AnnounceGoNotificationModalProps> = ({ isOpen, onClose }) => {
    const [comment, setComment] = useState<JSX.Element | string>('');

    useEffect(() => {
        const openAnnounce = async () => {
                setComment(
                    <div>
                        <p>메인 화면 오른쪽 위의 종 모양 아이콘을 눌러</p>
                        <p>일정 <span></span>수락/거절을 해주세요!</p>
                    </div>
                );
        }

        openAnnounce()
    }, [])

    return(
        <div>
            <OtherModal isOpen={isOpen} onClose={onClose} className="!gap-[14px]">
                {comment}
                <PurpleButton onClick={onClose} className="text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0" >확인</PurpleButton>
            </OtherModal>
        </div>
    )
}