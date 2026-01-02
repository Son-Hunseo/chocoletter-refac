import { useNavigate } from "react-router";
import giftbox_event_1 from "../assets/images/giftbox/giftbox_event_1.svg";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import KakaoLoginButton from "../components/login/button/KakaoLoginButton";
import Onboarding from "../components/onboarding/Onboarding";
import { giftBoxIdAtom, isLoginAtom } from "../atoms/auth/userAtoms";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

function LoginView() {
	const isLogin = useRecoilValue(isLoginAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);
	const navigate = useNavigate();

	useEffect(() => {
		if (isLogin) {
			navigate(`/main/${giftBoxId}`);
		}
	}, [isLogin, giftBoxId, navigate]);

	return (
		<div className="h-[calc((var(--vh, 1vh) * 100)-8rem)] flex flex-col items-center justify-center px-4 onboarding-intro-container">
			<div className="flex justify-center items-center mb-20">
				<h1 className="sr-only">
					발렌타인데이를 특별하게, 익명 편지 서비스!
				</h1>
			</div>

			{/* 로고 이미지 */}
			<div className="flex justify-center items-center mt-8 mb-10 pl-6">
				<img
					src={giftbox_event_1}
					alt="giftbox_event_1"
					style={{ width: "240px", height: "auto" }}
				/>{" "}
			</div>

			{/* 서비스 타이틀 및 서브타이틀 */}
			<div className="flex flex-col items-center mb-10">
				<img
					src={login_view_service_title}
					alt="login_view_service_title"
					className=""
				/>
				{/* <h1 className="text-gray-600 font-extrabold">chocoletter</h1> */}
			</div>

			{/* 온보딩 컴포넌트 */}
			<div className="w-full max-w-sm mb-6">
				<Onboarding />
			</div>

			{/* 로그인 버튼들 */}
			<div className="flex flex-col items-center mb-4">
				<KakaoLoginButton />
			</div>
		</div>
	);
}

export default LoginView;
