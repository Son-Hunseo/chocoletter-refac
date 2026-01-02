import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { isLoginAtom } from "../../../../../atoms/auth/userAtoms";
import { logout } from "../../../../../services/userApi";
import { OtherModal } from "../../../../common/OtherModal";
import { PurpleButton } from "../../../../common/PurpleButton";
import { useEffect, useState } from "react";

interface WhiteDayCountdownModalProps {
	targetDate: Date;
	isOpen: boolean;
	onClose: () => void;
}

const WhiteDayCountdownModal: React.FC<WhiteDayCountdownModalProps> = ({
	targetDate,
	isOpen,
	onClose,
}) => {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
	const [daysLeft, setDaysLeft] = useState<number>(0);

	useEffect(() => {
		const calculateDaysLeft = () => {
			const now = new Date();
			const diffTime = targetDate.getTime() - now.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			setDaysLeft(diffDays);
		};

		calculateDaysLeft();
		const interval = setInterval(calculateDaysLeft, 60 * 1000);
		return () => clearInterval(interval);
	}, [targetDate]);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (logoutError) {
			new Error("로그아웃 오류");
		}
		setIsLogin(false);
		if (!toast.isActive("logout-toast")) {
			toast.info("로그아웃 완료!", {
				toastId: "logout-toast",
				position: "top-center",
				autoClose: 2000,
			});
		}
		setIsLogin(false);
		onClose(); // 부모에서 전달받은 onClose로 모달 상태를 false로 전환
		navigate("/"); // 홈으로 이동
	};

	return (
		<OtherModal isOpen={isOpen} onClose={onClose}>
			<div className="text-center flex flex-col justify-center items-center gap-6">
				<div className="text-lg font-bold">
					화이트데이 디데이 카운트
				</div>
				<p className="text-sm text-gray-700">
					이제 상대방에게 초콜릿을 보낼 수 없어요! <br />
					화이트데이까지 {daysLeft}일 남았습니다. 그때 다시 만나요!{" "}
					<br />
				</p>
				<PurpleButton
					onClick={onClose}
					className="px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
				>
					확인
				</PurpleButton>
			</div>
		</OtherModal>
	);
};

export default WhiteDayCountdownModal;
