import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { giftBoxIdAtom, isLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import Backdrop from "../components/common/Backdrop";
import MyPage from "../components/my-page/MyPage";
import { ImageButton } from "../components/common/ImageButton";

import giftbox_before_12 from "../assets/images/giftbox/giftbox_before_12.svg";
import giftbox_before_22 from "../assets/images/giftbox/giftbox_before_22.svg";
import giftbox_before_32 from "../assets/images/giftbox/giftbox_before_32.svg";
import giftbox_before_42 from "../assets/images/giftbox/giftbox_before_42.svg";
import giftbox_before_52 from "../assets/images/giftbox/giftbox_before_52.svg";
import tutorial_icon from "../assets/images/main/tutorial_icon.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";
import NotLoginModal from "../components/main/your/before/modal/NotLoginModal";
import WhiteDayCountdownModal from "../components/main/your/before/modal/WhiteDayCountdownModal";
import { getGiftBoxName } from "../services/giftBoxApi";
import { FowardTutorialOverlay } from "../components/tutorial/FowardTutorialOverlay";
import Loading from "../components/common/Loading";
import { removeUserInfo } from "../services/userApi";
import tool_tip_your from "../assets/images/main/tool_tip_your.svg";
import my_chocolate_box_move_button from "../assets/images/main/my_chocolate_box_move_button.svg";

const DEFAULT_GIFTBOX_NAME = "초코레터";

const giftboxImages: { [key: number]: string } = {
	1: giftbox_before_12,
	2: giftbox_before_22,
	3: giftbox_before_32,
	4: giftbox_before_42,
	5: giftbox_before_52,
};

const MainYourEventView: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const setIsLogin = useSetRecoilState(isLoginAtom);
	const myGiftBoxId = useRecoilValue(giftBoxIdAtom);

	const { giftBoxId } = useParams<{ giftBoxId: string }>(); // URL에서 giftBoxId 추출

	const isLoggedIn = useRecoilValue(isLoginAtom);

	const tutorialIconRef = useRef<HTMLButtonElement>(null);
	const giftBoxRef = useRef<HTMLDivElement>(null);
	const dummyRef = useRef<HTMLDivElement>(null);

	// 로그인 상태가 아니라면 바로 NotLoginModal만 렌더링
	if (!isLoggedIn) {
		return (
			<NotLoginModal
				isOpen={true}
				onClose={() => {}}
				onLogin={() => {
					localStorage.setItem("redirect", location.pathname);
					navigate("/");
				}}
			/>
		);
	}

	// 선물상자에 표시할 이름과 로딩 상태
	const [recipientNickname, setRecipientNickname] = useState<string>("");
	// 새로 추가된 선물상자 타입 state (기본값 5)
	const [giftBoxType, setGiftBoxType] = useState<number>(5);
	const [isGiftBoxNameLoaded, setIsGiftBoxNameLoaded] =
		useState<boolean>(false);

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotLoginModalOpen, setIsNotLoginModalOpen] = useState(false);
	const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

	const handleProfile = () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		setIsProfileOpen((prev) => !prev);
	};

	const handleTutorial = () => {
		setIsTutorialModalOpen(true);
	};

	// 선물하기 버튼 클릭 시, 먼저 선물 전송 여부를 확인합니다.
	const handleGoToMyGiftBox = async () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		try {
			if (!giftBoxId) {
				// giftBoxId가 없으면 에러 처리
				removeUserInfo();
				setIsLogin(false);
				navigate("/");
				return;
			}
		} catch (error) {
			new Error("선물 상자 정보 조회 오류");
		}

		navigate(`/main/${myGiftBoxId}`);
	};

	// redirect 정보를 localStorage에 저장 후 로그인 페이지로 이동
	const handleGoToLogin = () => {
		localStorage.setItem("redirect", location.pathname);
		navigate("/");
	};

	const today = new Date();
	const currentYear = today.getFullYear();
	const eventDate = new Date(currentYear, 1, 14); // 2월 14일
	const whiteDay = new Date(currentYear, 2, 14); // 3월 14일

	const shouldShowCountdown = today >= eventDate && today < whiteDay;
	const [isCountdownOpen, setIsCountdownOpen] = useState(shouldShowCountdown);

	const tutorialIcons = useMemo(
		() => [
			tutorialIconRef,
			dummyRef,
			dummyRef,
			dummyRef,
			dummyRef,
			dummyRef,
			dummyRef,
			giftBoxRef,
		],
		[]
	);

	// giftBoxId가 있을 경우, 상대방 선물상자 정보 조회 (이제 name과 type을 받아옴)
	useEffect(() => {
		if (giftBoxId) {
			getGiftBoxName(giftBoxId)
				.then((data) => {
					// data의 타입은 { name: string, type: number, fillLevel: number }라고 가정
					const { name, type, fillLevel } = data;
					const validName =
						name && name.trim() !== "" ? name.trim() : null;

					if (validName) {
						setRecipientNickname(validName);
						localStorage.setItem("giftBoxName", validName);
					} else {
						const storedName = localStorage.getItem("giftBoxName");
						if (storedName && storedName.trim() !== "") {
							setRecipientNickname(storedName.trim());
						} else {
							setRecipientNickname(DEFAULT_GIFTBOX_NAME);
							localStorage.setItem(
								"giftBoxName",
								DEFAULT_GIFTBOX_NAME
							);
						}
					}
					// type 값에 따라 선물상자 타입 state 업데이트 (유효한 값인지 확인)
					if (type >= 1 && type <= 5) {
						setGiftBoxType(type);
					} else {
						setGiftBoxType(5);
					}
					setIsGiftBoxNameLoaded(true);
				})
				.catch((error) => {
					console.error("선물상자 정보 조회 에러:", error);
					setIsGiftBoxNameLoaded(true);
				});
		} else {
			// giftBoxId가 없으면 기본값 사용
			setRecipientNickname(DEFAULT_GIFTBOX_NAME);
			setIsGiftBoxNameLoaded(true);
		}
	}, [giftBoxId]);

	// API 호출이 끝나기 전에는 전체 페이지를 Loading 컴포넌트로 대체
	if (!isGiftBoxNameLoaded) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="flex justify-center w-full">
			<div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
				{/* 더미 div  */}
				<div ref={dummyRef} className="w-0 h-0" />
				{/* 상단 아이콘 바 */}
				<div className="mt-7 ml-6 flex items-center justify-between">
					<button onClick={handleTutorial} ref={tutorialIconRef}>
						<img
							src={tutorial_icon}
							className="w-6 h-6"
							alt="tutorial icon"
						/>
					</button>
					<button onClick={handleProfile} className="mr-5">
						<FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
					</button>
				</div>

				{/* 선물상자 컨테이너 */}
				<div
					className="mt-8 mb-10 mx-auto relative flex items-center justify-center"
					style={{
						backgroundImage: `url(${my_count_background})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						width: "74%",
						aspectRatio: "258/96",
					}}
				>
					{/* 배경 위에 텍스트를 중앙 정렬 */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div>
							<span className="text-2xl text-center max-w-full truncate">
								{recipientNickname}
							</span>
							<span className="text-lg text-center max-w-full truncate">
								{" "}
								님의{" "}
							</span>
						</div>
						<span className="text-lg text-center max-w-full truncate">
							초콜릿 보관함
						</span>
					</div>
				</div>

				<div
					className="flex flex-col items-center pl-10 mb-6"
					ref={giftBoxRef}
				>
					{/* giftBoxType에 따라 선물상자 이미지 동적으로 변경 */}
					<img
						src={giftboxImages[giftBoxType]}
						alt={`giftbox_before_${giftBoxType}`}
						className="p-2 max-h-60"
					/>
				</div>

				{/* 선물하기 버튼 */}
				<div className="mt-10 px-4 flex flex-row items-center justify-center">
					<div className="relative group">
						<ImageButton
							onClick={handleGoToMyGiftBox}
							src={my_chocolate_box_move_button}
							className="flex items-center justify-center heartbeat"
						/>
					</div>
				</div>

				{/* 로그인 필요 모달 */}
				{isNotLoginModalOpen && (
					<NotLoginModal
						isOpen={isNotLoginModalOpen}
						onClose={() => setIsNotLoginModalOpen(false)}
						onLogin={handleGoToLogin}
					/>
				)}

				{/* 프로필 모달 */}
				{isProfileOpen && (
					<>
						<Backdrop onClick={() => setIsProfileOpen(false)} />
						<MyPage onClose={() => setIsProfileOpen(false)} />
					</>
				)}

				{/* D-DAY 모달 (화이트데이까지 남은 일수 표시) */}
				<WhiteDayCountdownModal
					targetDate={whiteDay}
					isOpen={isCountdownOpen}
					onClose={() => setIsCountdownOpen(false)}
				/>
				{/* 튜토리얼 모달 */}
				{isTutorialModalOpen && (
					<FowardTutorialOverlay
						targetRefs={tutorialIcons}
						onClose={() => setIsTutorialModalOpen(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default MainYourEventView;
