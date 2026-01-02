import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import choco from "../assets/images/chocolate/general/gen_choco_4.svg";
import wing_left from "../assets/images/chocolate/wing_left.svg";
import wing_right from "../assets/images/chocolate/wing_right.svg";
import { ImageButton } from "../components/common/ImageButton";
import go_to_my_main_button from "../assets/images/button/go_to_my_main_button.svg";

// 편지 작성 완료 후, 전송 완료 페이지
const SentGiftView = () => {
	const [remainTime, setRemainTime] = useState(10);
	const navigate = useNavigate();
	const giftBoxId = localStorage.getItem("giftBoxId");

	useEffect(() => {
		const interval = setInterval(() => {
			setRemainTime((prev) => {
				if (prev === 1) {
					navigate("/main/my/before"); // 추후 수정 예정
					clearInterval(interval);
					return 1;
				} else {
					return prev - 1;
				}
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const goBackMainMyBefore = () => {
		navigate(`/main/${giftBoxId}`);
	};

	return (
		//[#FFEEFD]
		<div className="relative flex flex-col items-center h-screen bg-chocoletterGiftBoxBg">
			<div className="absolute mt-24 px-8">
				<div className="relative flex items-center justify-center mb-16 shake-vertical">
					{/* 왼쪽 날개 */}
					<object
						data={wing_right}
						type="image/svg+xml"
						className="w-[40px] transform scale-x-[-1] relative -mr-4 z-10"
					>
						<img src={wing_right} alt="왼쪽 날개" />
					</object>

					{/* 초콜릿 */}
					<object
						data={choco}
						type="image/svg+xml"
						className= "w-[80px] relative z-20"// "max-h-40 relative z-20"
					>
						<img src={choco} alt="초콜릿" />
					</object>

					{/* 오른쪽 날개 */}
					<object
						data={wing_right}
						type="image/svg+xml"
						className="w-[40px] relative -ml-4 z-10"
					>
						<img src={wing_right} alt="오른쪽 날개" />
					</object>
				</div>
				<h1 className="text-center text-[18px] font-bold mb-4">
					달콤한 초콜릿 편지가 무사히 전해졌어요! <br />내 초콜릿
					보관함도 전해보세요.💕
				</h1>
				<h3 className="text-center text-sm text-gray-500 font-bold mb-24">
					편지를 2개 받을 때마다, <br />
					2월 14일 전에도 하나를 먼저 열어볼 수 있답니다!
				</h3>
				<div className="flex flex-col justify-center items-center mb-8 text-center">
					<ImageButton
						onClick={goBackMainMyBefore}
						src={go_to_my_main_button}
						className="mb-4"
					/>

					{/* <Button onClick={goBackMainMyBefore} className="bg-white w-[300px] h-[50px] px-1 mb-4 hover:bg-gray-200">
            내 초콜릿 상자로 이동하기
          </Button> */}
					<div className="w-[270px] p-[5px_15px] rounded-[18px] bg-white text-sm text-cholo">
						{remainTime}초 후, 내 초콜릿 보관함으로 이동합니다.
					</div>
				</div>
			</div>
		</div>
	);
};

export default SentGiftView;
