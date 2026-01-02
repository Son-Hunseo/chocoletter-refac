import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../../atoms/auth/userAtoms";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
	const navigate = useNavigate();
	const isLogin = useRecoilValue(isLoginAtom);

	useEffect(() => {
		if (!isLogin) {
			navigate("/");
		}
	}, [isLogin, navigate]);

	return <Outlet />;
};

export default ProtectedRoute;
