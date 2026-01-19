import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../../atoms/auth/userAtoms";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
	const navigate = useNavigate();
	const isLogin = useRecoilValue(isLoginAtom);

	useEffect(() => {
		// recoil-persist 초기화 전에도 localStorage로 체크 (개발 모드 StrictMode 대응)
		const accessToken = localStorage.getItem("accessToken");
		if (!isLogin && !accessToken) {
			navigate("/");
		}
	}, [isLogin, navigate]);

	return <Outlet />;
};

export default ProtectedRoute;
