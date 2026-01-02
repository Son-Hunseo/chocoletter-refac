import React, { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
import { getGiftBoxId } from "../../../../../services/userApi";
import useScript from "../../../../../hooks/useScript";
import { initializeKakao } from "../../../../../utils/sendKakaoTalk";
import { QRCodeCanvas } from "qrcode.react";
import KakaoShareButton from "../button/KakaoShareButton";
import { GoLink } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";

interface ShareModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
	const [sharedLink, setSharedLink] = useState("");
	const [showQRCode, setShowQRCode] = useState(false);
	const [qrLoading, setQrLoading] = useState(false);
	const [isLinkLoading, setIsLinkLoading] = useState(false); // giftBoxId 준비 여부

	// Kakao SDK 로드
	const { loaded, error } = useScript({
		src: "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js",
		integrity:
			"sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka",
		crossorigin: "anonymous",
	});

	// 카카오 공유하기 불러오기
	useEffect(() => {
		if (loaded && !error) {
			initializeKakao();
		} else if (error) {
			new Error("Kakao SDK 로드 중 오류 발생");
		}
	}, [loaded, error]);

	useEffect(() => {
		async function fetchShareCode() {
			try {
				setIsLinkLoading(true);
				setSharedLink("");
				const giftBoxId = await getGiftBoxId();
				if (!giftBoxId || giftBoxId.trim() === "") {
					setSharedLink(window.location.href);
				} else {
					setSharedLink(
						`https://www.chocolate-letter.com/main/${giftBoxId}`
					);
				}
			} catch (e) {
				setSharedLink(window.location.href);
			} finally {
				setIsLinkLoading(false);
			}
		}

		if (isOpen) {
			setShowQRCode(false);
			fetchShareCode();
		}
	}, [isOpen]);

	// (A) 복사 + 모바일 공유 시도
	const handleCopyAndShare = async () => {
		if (!sharedLink) {
			return;
		}

		await copyToClipboard(sharedLink);
		alert("링크 복사 완료! 친구들에게 공유해보세요!");

		// *** 모바일 Web Share API로 공유할 때 사용!
		// if (navigator.share) {
		//   await navigator.share({
		//     title: "초콜릿 박스 공유",
		//     text: "초콜릿 박스에서 편지를 받아보세요!",
		//     url: sharedLink,
		//   });
		// } else {
		//   alert("링크가 복사되었습니다! 친구들에게 공유해보세요!");
		// }
		// } catch (err) {
		// 	console.error("공유 중 오류:", err);
		// }
	};

	// (B) QR 코드 표시
	const handleShowQRCode = () => {
		if (!sharedLink) {
			return;
		}
		setQrLoading(true);
		setTimeout(() => {
			setQrLoading(false);
			setShowQRCode(true);
		}, 200);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
				setShowQRCode(false);
				setSharedLink("");
			}}
		>
			<div className="flex flex-col items-center rounded-2xl">
				<h2 className="text-md font-thin mb-4">나도 초콜릿 받기!</h2>

				{/** 로딩 필요하면 다시 넣을 예정! */}
				{/* {isLinkLoading && <Loading />} */}

				{/** 로딩 중이 아니라면 UI를 표시 */}
				{!isLinkLoading && (
					<>
						{!showQRCode ? (
							<div className="flex flex-row justify-center space-x-4">
								{/* (a) 복사 + 모바일 공유 */}
								<button
									onClick={handleCopyAndShare}
									className="w-16 h-16 flex justify-center items-center bg-sky-200 p-4 rounded-lg border border-black"
								>
									<GoLink className="text-3xl text-gray-700" />
								</button>

								{/* (b) QR 코드 버튼 */}
								<button
									onClick={handleShowQRCode}
									className="w-16 h-16 flex justify-center items-center bg-gray-500 p-4 rounded-lg border border-black"
								>
									<BsQrCode className="text-3xl text-white" />
								</button>

								{/* (c) 카카오 공유 */}
								<KakaoShareButton shareLink={sharedLink} />
							</div>
						) : (
							<div className="flex flex-col items-center">
								<QRCodeCanvas value={sharedLink} size={256} />
							</div>
						)}
					</>
				)}
			</div>
		</Modal>
	);
};

export default ShareModal;
