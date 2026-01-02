import React from "react";
import { OneButtonModal } from "../../common/OneButtonModal";

interface changeGeneralGiftProps {
    isOpen: boolean;
    onClose: () => void;
}

const changeGeneralGiftModal: React.FC<changeGeneralGiftProps> = ({ isOpen, onClose }) => {
    return (
        <div>
            <OneButtonModal isOpen={isOpen} onClose={onClose}>
                <p>일반 초콜릿으로<br/>당신의 마음이 따듯하게 전달되었습니다.</p>
                <p>OOO님도 분명히<br/> 그 달콤한 마음을 느낄 거예요!😊</p>
            </OneButtonModal>
        </div>
    )
}

export default changeGeneralGiftModal;