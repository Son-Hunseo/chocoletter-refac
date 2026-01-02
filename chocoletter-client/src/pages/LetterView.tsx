import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedGiftIdAtom } from "../atoms/gift/giftAtoms";
import { GoBackButton } from "../components/common/GoBackButton";
import { getGiftDetail } from "../services/giftApi";
import Gift from "../components/letter/Letter";
import Loading from "../components/common/Loading";
import {
	giftBoxIdAtom,
	isLoginAtom,
	memberIdAtom,
} from "../atoms/auth/userAtoms";
import { decryptLetter } from "../services/giftEncryptedApi";
import { getMemberPrivateKey } from "../utils/keyManager";
import { getGiftBoxPublicKey } from "../services/keyApi";
import { logout } from "../services/userApi";
import LetterEncryptedNoneModal from "../components/letter/modal/LetterEncryptedNoneModal";
import { useNavigate } from "react-router-dom";

// 편지 보는 뷰
// gift list page 에서 초콜릿 선택 시 보이게 됨.
interface GiftData {
	nickName?: string;
	content?: string | null;
	question?: string | null;
	answer?: string | null;
}

const LetterView = () => {
	const selectedGiftId = useRecoilValue(selectedGiftIdAtom);
	const memberId = useRecoilValue(memberIdAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);
	const isLogin = useRecoilValue(isLoginAtom);
	const navigate = useNavigate();

	const [giftData, setGiftData] = useState<GiftData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<number | null>(null);
	const [isLetterEncryptedNoneModalOpen, setIsLetterEncryptedNoneModalOpen] =
		useState(false);

	useEffect(() => {
		const fetchGiftData = async () => {
			if (selectedGiftId) {
				try {
					const data = await getGiftDetail(selectedGiftId);
					let updatedData: GiftData = { ...data };

					const privateKey = await getMemberPrivateKey(memberId);
					if (!privateKey) {
						setLoading(false);
						return;
					}

					const publicKey = await getGiftBoxPublicKey(giftBoxId);

					if (data.question && data.answer) {
						try {
							const plainAnswer = await decryptLetter(
								data.answer,
								publicKey,
								privateKey
							);
							updatedData.answer = plainAnswer; // 복호화된 답변을 giftData.answer에 반영
						} catch (e) {
							updatedData.answer =
								"브라우저가 변경된 것 같아요. 다시 로그인 해주세요!";
							setIsLetterEncryptedNoneModalOpen(true);
						}
					} else if (data.content) {
						try {
							const plainContent = await decryptLetter(
								data.content,
								publicKey,
								privateKey
							);
							updatedData.content = plainContent; // 복호화된 편지 내용을 giftData.content에 반영
						} catch (e) {
							updatedData.content =
								"브라우저가 변경된 것 같아요. 다시 로그인 해주세요!";
							setIsLetterEncryptedNoneModalOpen(true);
						}
					}

					setGiftData(updatedData);
				} catch (error: any) {
					if (error.response?.status === 403) {
						setError(403); // 에러 상태 설정
					} else {
						setError(error.response?.status || 500); // 기타 에러 처리
					}
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};
		fetchGiftData();
	}, [selectedGiftId]);

	const backgroundClass = giftData?.question
		? "bg-letter-blue-background"
		: "bg-letter-pink-background";

	return (
		<div
			className={`relative flex flex-col items-center h-screen ${backgroundClass}`}
		>
			{/* GoBackButton을 좌측 상단에 고정 */}
			<GoBackButton strokeColor="#9E4AFF" />

			{/* 추후 삭제!! 선택된 Gift ID 표시 */}
			{/* <div className="mt-4 text-center text-gray-600">
                <p>
                    <strong>Selected Gift ID:</strong> {selectedGiftId}
                </p>
            </div> */}

			{/* 메인 콘텐츠 렌더링 */}
			{loading ? (
				<Loading />
			) : error === 403 ? (
				<ForbiddenView />
			) : (
				<div className="absolute mt-[41px] m-4">
					<GiftView
						giftData={
							giftData || {
								nickName: "Anonymous",
								content: "No content",
								question: null,
								answer: null,
							}
						}
					/>
					{isLetterEncryptedNoneModalOpen && (
						<LetterEncryptedNoneModal
							isOpen={isLetterEncryptedNoneModalOpen}
							onClose={() =>
								setIsLetterEncryptedNoneModalOpen(false)
							}
						/>
					)}
				</div>
			)}
		</div>
	);
};

// 403 에러 화면 컴포넌트
const ForbiddenView = () => (
	<div className="flex flex-col justify-center items-center h-full text-2xl p-4">
		<h1 className="font-bold">
			선물을 열어보려면 <br />
			두 개의 편지를 작성하거나, <br />
			2월 14일을 기다려야 해요!😥
		</h1>
	</div>
);

// Gift 컴포넌트 렌더링 컴포넌트
const GiftView: React.FC<{ giftData: GiftData }> = ({ giftData }) => (
	<div className="flex flex-col justify-center items-center">
		<Gift
			nickName={giftData.nickName || "Anonymous"}
			content={giftData.content || null}
			question={giftData.question || "No question provided"}
			answer={giftData.answer || "No answer provided"}
		/>
	</div>
);

export default LetterView;
