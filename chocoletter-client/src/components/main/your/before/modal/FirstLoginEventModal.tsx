import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { isLoginAtom } from "../../../../../atoms/auth/userAtoms";
import { logout } from "../../../../../services/userApi";
import { OtherModal } from "../../../../common/OtherModal";
import { PurpleButton } from "../../../../common/PurpleButton";

interface FirstLoginEventModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const FirstLoginEventModal: React.FC<FirstLoginEventModalProps> = ({
	isOpen,
	onClose,
}) => {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);

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
		<OtherModal isOpen={isOpen} onClose={handleLogout}>
			<div className="text-center flex flex-col justify-center items-center gap-6">
				<div className="text-lg font-bold">발렌타인데이 D-DAY</div>
				<p className="text-sm text-gray-700">
					원활한 서비스를 위해 다시 로그인 해주세요!
				</p>
				<PurpleButton
					onClick={handleLogout}
					className="px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
				>
					확인
				</PurpleButton>
			</div>
		</OtherModal>
	);
};

export default FirstLoginEventModal;
