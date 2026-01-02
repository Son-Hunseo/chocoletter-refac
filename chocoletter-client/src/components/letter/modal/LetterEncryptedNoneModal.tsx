import { useNavigate } from "react-router";
import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";
import { logout } from "../../../services/userApi";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { isLoginAtom } from "../../../atoms/auth/userAtoms";

interface LetterEncryptedNoneModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const LetterEncryptedNoneModal: React.FC<LetterEncryptedNoneModalProps> = ({
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
				<div className="text-lg font-bold">브라우저 변경 알림</div>
				<p className="text-sm text-gray-700">로그인을 다시 해주세요!</p>
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

export default LetterEncryptedNoneModal;
