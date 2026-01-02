import React from "react";
import { OtherModal } from "../../../../common/OtherModal";
import { PurpleButton } from "../../../../common/PurpleButton";
import plane from "../../../../../assets/images/main/plane.svg"

interface AlreadySentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onModify: () => void;
}

const AlreadySentModal: React.FC<AlreadySentModalProps> = ({
	isOpen,
	onClose,
	onModify,
}) => {
	return (
		<OtherModal isOpen={isOpen} onClose={onClose}>
			<div className="w-[250px] h-[180px] text-center flex flex-col justify-center items-center gap-6">
				<div className="flex flex-col items-center gap-2 h-[90px]">
                    <img src={plane} alt="" />
					<div className="text-lg font-bold">이미 선물을 보냈습니다!</div>
					<p className="text-sm text-gray-700">
						보낸 편지를 수정하시겠습니까?
					</p>
				</div>
				<div className="flex flex-row gap-8">
					<PurpleButton
						onClick={onClose}
						className="px-6 py-3 text-black bg-white border border-black outline-none focus:ring-0"
					>
						취소
					</PurpleButton>
					<PurpleButton
						onClick={onModify}
						className="px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
					>
						수정
					</PurpleButton>
				</div>
			</div>
		</OtherModal>
	);
};

export default AlreadySentModal;
