import React from "react";
import { OtherModal } from "../../../../common/OtherModal";
import readLetterIcon from "../../../../../assets/images/letter/letter_icon.svg";

export interface AcceptRejectModalProps {
	alarm?: {
		alarmId: number;
		alarmType:
			| "ACCEPT_SPECIAL"
			| "REJECT_SPECIAL"
			| "RECEIVE_SPECIAL"
			| "UNBOXING_NOTICE";
		partnerName: string;
		unBoxingTime?: string;
		giftId: string | null;
		read: boolean;
	};
	onClose: () => void;
	onAccept: () => void;
	onReject: () => void;
}

const AcceptRejectModal: React.FC<AcceptRejectModalProps> = ({
	alarm,
	onClose,
	onAccept,
	onReject,
}) => {
	return (
		<OtherModal isOpen={true} onClose={onClose}>
			<div className="text-center flex flex-col justify-center items-center gap-6">
				{/* 아이콘 영역 */}
				<div className="w-7 h-7">
					<img
						src={readLetterIcon}
						alt="편지 아이콘"
						className="w-full h-full"
					/>
				</div>
				{/* 메시지 영역 */}
				<div className="flex flex-col gap-4">
					<p className="w-[260px] text-base font-semibold">
						발렌타인데이에 만나시겠어요?
						{/* {alarm.partnerName}님과 발렌타인데이에 만나시겠어요? */}
					</p>
				</div>
				{/* 버튼 영역 */}
				<div className="w-full flex justify-evenly">
					<button
						onClick={onReject}
						className="bg-white text-black border border-black px-[30px] py-[5px] rounded-[18px] hover:bg-chocoletterPurpleBold hover:text-white"
					>
						아니요..
					</button>
					<button
						onClick={onAccept}
						className="bg-chocoletterPurpleBold border border-black text-white px-[30px] py-[5px] rounded-[18px] hover:bg-chocoletterPurpleBold"
					>
						좋아요!!
					</button>
				</div>
			</div>
		</OtherModal>
	);
};

export default AcceptRejectModal;
