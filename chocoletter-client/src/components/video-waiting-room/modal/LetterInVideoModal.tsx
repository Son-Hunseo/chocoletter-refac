import React from "react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
// import axios from "axios";
import GeneralLetterModal from "../../common/GeneralLetterModal"
import Loading from "../../common/Loading";
import { memberIdAtom, giftBoxIdAtom } from "../../../atoms/auth/userAtoms";
import { getGiftDetail } from "../../../services/giftApi";
import { getMemberPrivateKey } from "../../../utils/keyManager";
import { getGiftBoxPublicKey } from "../../../services/keyApi";
import { decryptLetter } from "../../../services/giftEncryptedApi";

interface LetterInVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onErrorClose: () => void;
  giftId: string;
}

interface GiftData {
	nickName?: string;
	content?: string | null;
	question?: string | null;
	answer?: string | null;
}

const LetterInVideoModal: React.FC<LetterInVideoModalProps> = ({ isOpen, onClose, onErrorClose, giftId }) => {
  // const selectedGiftId = useRecoilValue(selectedGiftIdAtom);
	const memberId = useRecoilValue(memberIdAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);

	const [giftData, setGiftData] = useState<GiftData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<number | null>(null);
	// const [isLetterEncryptedNoneModalOpen, setIsLetterEncryptedNoneModalOpen] = useState(false);

	useEffect(() => {
		console.log(giftId);
		const fetchGiftData = async () => {
			if (giftId) {
				try {
					const data = await getGiftDetail(giftId);
					let updatedData: GiftData = { ...data };

					const privateKey = await getMemberPrivateKey(memberId);
					if (!privateKey) {
						setLoading(false);
						return;
					}

					const publicKey = await getGiftBoxPublicKey(giftBoxId);

					if (data !== null) {
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
								// setIsLetterEncryptedNoneModalOpen(true);
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
								// setIsLetterEncryptedNoneModalOpen(true);
							}
						}
					}

					setGiftData(updatedData);
				} catch (error: any) {
					if (error.response?.status === 403) {
						onErrorClose();
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
	}, [giftId]);
  
  return (
    <>
      {/* 메인 콘텐츠 렌더링 */}
			{loading ? (
				<Loading />
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
				</div>
			)}
    </>
  );
};

export default LetterInVideoModal;