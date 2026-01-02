import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { ImageButton } from "../components/common/ImageButton";
import free_letter_button from "../assets/images/button/free_letter_button.svg";
import question_letter_button from "../assets/images/button/question_letter_button.svg";
import Loading from "../components/common/Loading";

function SelectLetterTypeView() {
	const { giftBoxId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	// 이미지 preloading: 두 이미지가 모두 로드되면 loading 상태를 false로 변경
	useEffect(() => {
		const loadImages = async () => {
			try {
				await Promise.all([
					new Promise<void>((resolve, reject) => {
						const img = new Image();
						img.src = free_letter_button;
						img.onload = () => resolve();
						img.onerror = () =>
							reject(
								new Error("free_letter_button failed to load")
							);
					}),
					new Promise<void>((resolve, reject) => {
						const img = new Image();
						img.src = question_letter_button;
						img.onload = () => resolve();
						img.onerror = () =>
							reject(
								new Error(
									"question_letter_button failed to load"
								)
							);
					}),
				]);
				setLoading(false);
			} catch (error) {
				console.error("이미지 로딩 실패:", error);
				// 이미지 로딩에 실패하더라도 페이지는 렌더링합니다.
				setLoading(false);
			}
		};

		loadImages();
	}, []);

	const handleAccept = () => {
		navigate(`/write/general/${giftBoxId}`);
	};

	const handleReject = () => {
		navigate(`/write/question/${giftBoxId}`);
	};

	return (
		<div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
			{loading ? (
				<Loading />
			) : (
				<>
					{/* 상단 Bar */}
					<div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
						<div className="self-stretch justify-between items-center inline-flex">
							<div className="w-6 h-6 flex justify-center items-center">
								<GoBackButton />
							</div>
							<div className="text-center text-white text-2xl font-normal font-sans leading-snug">
								편지지 선택하기
							</div>
							<div className="w-6 h-6" />
						</div>
					</div>

					{/* 콘텐츠 영역 */}
					<div className="absolute mt-24">
						<div className="flex flex-col items-center justify-center m-4">
							<h1 className="text-[22px] font-bold mb-[30px]">
								발렌타인데이, <br />
								마음을 전할 편지지를 선택하세요!💌
							</h1>
							<div className="flex flex-col items-center gap-[20px]">
								<ImageButton
									onClick={handleAccept}
									src={free_letter_button}
								/>
								<ImageButton
									onClick={handleReject}
									src={question_letter_button}
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default SelectLetterTypeView;
