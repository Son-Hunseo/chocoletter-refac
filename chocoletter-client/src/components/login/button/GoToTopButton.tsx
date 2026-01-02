import React, { useState, useEffect } from "react";
import login_view_top_arrow from "../../../assets/images/button/login_view_top_arrow.svg";

type GoToTopButtonProps = {
	className?: string;
	scrollThreshold?: number;
};

const GoToTopButton: React.FC<GoToTopButtonProps> = ({
	className = "",
	scrollThreshold = 600,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	// 스크롤 이벤트 핸들러
	const toggleVisibility = () => {
		if (window.pageYOffset > scrollThreshold) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// 스크롤 이벤트 리스너 등록
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [scrollThreshold]);

	// 스크롤 최상단으로 부드럽게 이동
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth", // 부드러운 스크롤
		});
	};

	return (
		<>
			<img
				src={login_view_top_arrow}
				alt="Go to top"
				onClick={scrollToTop}
				className="w-10 h-10"
			/>
		</>
	);
};

export { GoToTopButton };
