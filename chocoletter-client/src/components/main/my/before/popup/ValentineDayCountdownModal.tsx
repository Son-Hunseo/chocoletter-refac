import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { OtherModal } from "../../../../common/OtherModal";
import { PurpleButton } from "../../../../common/PurpleButton";

interface ValentineDayCountdownModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ValentineDayCountdownModal: React.FC<ValentineDayCountdownModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [cookies, setCookie] = useCookies(["valentineCountdownShown"]);
	const [daysLeft, setDaysLeft] = useState<number>(0);

	useEffect(() => {
		const now = new Date();
		// 2월 14일을 targetDate로 설정 (월은 0부터 시작하므로 1은 2월입니다.)
		const targetDate = new Date(now.getFullYear(), 1, 14);
		if (now >= targetDate) return;

		const calcDaysLeft = () => {
			const diffTime = targetDate.getTime() - new Date().getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			setDaysLeft(diffDays);
		};

		calcDaysLeft();
		const intervalId = setInterval(calcDaysLeft, 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	const handleConfirm = () => {
		const todayStr = new Date().toISOString().split("T")[0];
		const expireDate = new Date();
		expireDate.setHours(23, 59, 59, 999);
		setCookie("valentineCountdownShown", todayStr, {
			path: "/",
			expires: expireDate,
		});
		onClose();
	};

	return (
		<OtherModal isOpen={isOpen} onClose={handleConfirm}>
			<div className="text-center flex flex-col justify-center items-center gap-6">
				<div className="text-lg font-bold">초코레터 디데이</div>
				<p className="text-sm text-gray-700">
					2월 14일까지 {daysLeft}일 남았습니다! <br />
					발렌타인데이에 모든 초콜릿을 열어주세요!
				</p>
				<PurpleButton
					onClick={handleConfirm}
					className="px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
				>
					확인
				</PurpleButton>
			</div>
		</OtherModal>
	);
};

export default ValentineDayCountdownModal;
