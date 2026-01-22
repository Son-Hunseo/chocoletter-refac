import React from "react";
import { sendKakaoShare } from "../../../../../utils/sendKakaoTalk";
import { userNameAtom } from "../../../../../atoms/auth/userAtoms";
import { useRecoilValue } from "recoil";

interface KakaoShareButtonProps {
	shareLink: string; // 부모(ShareModal)에서 받은 공유 링크
}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({ shareLink }) => {
	const userName = useRecoilValue(userNameAtom);

	const handleKakaoShare = () => {
		// Kakao 링크에 사용될 옵션
		const shareContent: Kakao.ShareOptions = {
			objectType: "feed",
			content: {
				title: `${userName}님에게 초콜릿을 전해보세요!💌`,
				description: "모든 초콜릿(편지)은 익명으로 전달됩니다.",
				imageUrl:
					"https://chocoletter.sonhs.com/chocoletter_kakao_logo2.png",
				link: {
					mobileWebUrl: shareLink, // (2) shareLink 사용
					webUrl: shareLink,
				},
			},
			buttons: [
				{
					title: `초콜릿 보내러 가기`,
					link: {
						mobileWebUrl: shareLink,
						webUrl: shareLink,
					},
				},
			],
		};

		// 실제 공유 호출
		sendKakaoShare(shareContent);
	};

	return (
		<button
			onClick={handleKakaoShare}
			className="w-16 h-16 flex justify-center items-center bg-yellow-300 p-1 rounded-lg border border-black transition focus:outline-none"
			aria-label="카카오톡 공유"
		>
			<img
				src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
				alt="카카오톡 공유 보내기 버튼"
				className="w-10 h-10 opacity-80"
			/>
		</button>
	);
};

export default KakaoShareButton;
