import { useEffect } from "react";

const useViewportHeight = () => {
	useEffect(() => {
		const setVH = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		};

		// 초기 설정
		setVH();

		// 창 크기 변경 시 업데이트
		window.addEventListener("resize", setVH);

		// 클린업
		return () => {
			window.removeEventListener("resize", setVH);
		};
	}, []);
};

export default useViewportHeight;
