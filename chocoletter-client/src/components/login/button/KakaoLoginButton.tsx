import React, { useState } from "react";
import { ImageButton } from "../../common/ImageButton";
import kakao_login_button_2 from "../../../assets/images/button/kakao_login_button_2.svg";
import Loading from "../../common/Loading";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../services/userInfo";
import { useRecoilValue } from "recoil";
import { giftBoxIdAtom } from "../../../atoms/auth/userAtoms";
import { logout, removeUserInfo } from "../../../services/userApi";
import { toast } from "react-toastify";

const KakaoLoginButton: React.FC = () => {
	const navigate = useNavigate();
	// 로컬 스토리지의 유저 정보(로그인 여부) 확인
	const userInfo = getUserInfo();
	const giftBoxId = useRecoilValue(giftBoxIdAtom);

	// 로딩 표시
	const [isLoading, setIsLoading] = useState(false);

	const kakaoAuthUrl = `${
		import.meta.env.VITE_API_SERVER_URL
	}/api/v1/auth/kakao`;

	const handleClick = async () => {
		// 이미 로그인 정보가 있다면 (한 번이라도 로그인됨)
		if (userInfo?.accessToken) {
			if (giftBoxId) {
				navigate(`/main/${giftBoxId}`);
			} else {
				removeUserInfo();
				await logout();
				navigate("/");
				if (!toast.isActive("require-login-toast")) {
					toast.error("다시 로그인해주세요.", {
						toastId: "require-login-toast",
						position: "top-center",
						autoClose: 2000,
					});
				}
			}
		} else {
			// 처음 로그인 -> 백엔드로 리다이렉트
			setIsLoading(true);
			window.location.replace(kakaoAuthUrl);
		}
	};

	return (
		<div>
			<a
				onClick={(e) => {
					e.preventDefault();
					handleClick();
				}}
				className="inline-block cursor-pointer"
			>
				<ImageButton
					src={kakao_login_button_2}
					className="opacity-90"
				/>
			</a>

			{/* 로딩 중이면 Loading 컴포넌트 표시 (선택 사항) */}
			{isLoading && <Loading />}
		</div>
	);
};

export default KakaoLoginButton;
