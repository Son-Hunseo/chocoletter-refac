import React from "react";
import { useState, useEffect } from "react";
import GeneralLetterModal from "../../common/GeneralLetterModal";
import { useRecoilValue } from "recoil";
import { memberIdAtom, giftBoxIdAtom } from "../../../atoms/auth/userAtoms";
import Loading from "../../common/Loading";

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

	useEffect(() => {
		const fetchGiftData = async () => {
			if (nickName && (content || answer || question)) {
				try {
					// Server now returns decrypted content, no client-side decryption needed
					const data = {
						nickName: nickName,
						content: content,
						question: question,
						answer: answer,
					};
					setGiftData(data);
				} catch (error: any) {
					if (error.response?.status === 403) {
						setError(403);
					} else {
						setError(error.response?.status || 500);
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
