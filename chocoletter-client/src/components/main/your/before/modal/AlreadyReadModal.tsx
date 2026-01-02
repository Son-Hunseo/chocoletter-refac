import React from "react";
import { OtherModal } from "../../../../common/OtherModal";
import { PurpleButton } from "../../../../common/PurpleButton";
import plane from "../../../../../assets/images/main/plane.svg"

interface AlreadyReadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AlreadyReadModal: React.FC<AlreadyReadModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <OtherModal isOpen={isOpen} onClose={onClose}>
            <div className="w-[250px] h-[180px] text-center flex flex-col justify-center items-center gap-6">
                <div className="flex flex-col items-center gap-2 h-[90px]">
                    <img src={plane} alt="" />
                    <div className="text-lg">이런...! 이미 상대방이 편지를 <br/> 읽어서 수정할 수 없어요.</div>
                </div>
                <div className="flex flex-row gap-8">
                    <PurpleButton
                        onClick={onClose}
                        className="w-[180px] px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
                    >
                        확인
                    </PurpleButton>
                </div>
            </div>
        </OtherModal>
    );
};

export default AlreadyReadModal;
