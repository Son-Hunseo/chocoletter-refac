import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeneralLetterModal from "../../common/GeneralLetterModal";
import { useRecoilValue } from "recoil";
import { getGiftDetail } from "../../../services/giftApi";
import { memberIdAtom, giftBoxIdAtom } from "../../../atoms/auth/userAtoms";
import Loading from "../../common/Loading";
import { decryptLetter } from "../../../services/giftEncryptedApi";
import { getMemberPrivateKey } from "../../../utils/keyManager";
import { getGiftBoxPublicKey } from "../../../services/keyApi";
import LetterEncryptedNoneModal from "../../letter/modal/LetterEncryptedNoneModal";

interface LetterInChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	nickName?: string;
	content?: string | null;
	question?: string | null;
	answer?: string | null;
}

interface GiftData {
	nickName?: string;
	content?: string | null;
	question?: string | null;
	answer?: string | null;
}

const LetterInChatModal: React.FC<LetterInChatModalProps> = ({
	isOpen,
	onClose,
	nickName,
	content,
	question,
	answer,
}) => {
	const memberId = useRecoilValue(memberIdAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);

	const [giftData, setGiftData] = useState<GiftData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<number | null>(null);
	const [isLetterEncryptedNoneModalOpen, setIsLetterEncryptedNoneModalOpen] =
		useState(false);

	useEffect(() => {
		const fetchGiftData = async () => {
			if (nickName && (content || answer || question)) {
				try {
					const data = {
						nickName: nickName,
						content: content,
						question: question,
						answer: answer,
					};
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
	}, [nickName, content, question, answer]);

	return (
		<>
			{/* 메인 콘텐츠 렌더링 */}
			{loading ? (
				<Loading />
			) : error === 403 ? (
				<ForbiddenView />
			) : (
				<div className="absolute mt-[41px] m-4">
					<GeneralLetterModal
						isOpen={isOpen}
						onClose={onClose}
						nickName={giftData?.nickName}
						content={giftData?.content}
						question={giftData?.question}
						answer={giftData?.answer}
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
		</>
	);
};

const ForbiddenView = () => (
	<div className="flex flex-col justify-center items-center h-full text-2xl p-4">
		<h1 className="font-bold">
			선물을 열어보려면 <br />
			두 개의 편지를 작성하거나, <br />
			2월 14일을 기다려야 해요!😥
		</h1>
	</div>
);

export default LetterInChatModal;
