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
import { useNavigate } from "react-router-dom";

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

	useEffect(() => {
		const fetchGiftData = async () => {
			if (selectedGiftId) {
				try {
					const data = await getGiftDetail(selectedGiftId);
					// Server now returns decrypted content
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
	}, [selectedGiftId]);

	const backgroundClass = giftData?.question
		? "bg-letter-blue-background"
		: "bg-letter-pink-background";

	return (
		<div
			className={`relative flex flex-col items-center h-screen ${backgroundClass}`}
		>
			<GoBackButton strokeColor="#9E4AFF" />

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
				</div>
			)}
		</div>
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
