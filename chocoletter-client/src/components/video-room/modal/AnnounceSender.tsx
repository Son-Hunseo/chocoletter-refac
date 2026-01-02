import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface AnnounceSenderProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AnnounceSender: React.FC<AnnounceSenderProps> = ({ isOpen, onClose }) => {
    return (
        <>
            <OtherModal isOpen={isOpen} onClose={onClose} >
                <p className="text-nowrap">보내신 분은 편지를 읽을 수 없어요!</p>
                <p className="text-nowrap">받은 분으로부터 쓴 편지의 내용을 들어보세요</p>

                <PurpleButton onClick={onClose} className="font-sans text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0">
                    확인
                </PurpleButton>
            </OtherModal>
        </>
    )
};