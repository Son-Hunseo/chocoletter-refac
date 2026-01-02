import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { GoBackMainMyButton } from "../components/gift-list/button/GoBackMainMyButton";
import { GiftList } from "../components/gift-list/GiftList";
import { countMyGiftBox } from "../services/giftBoxApi";
import {
	availableGiftsAtom,
	giftListRefreshAtom,
} from "../atoms/gift/giftAtoms";
import { getGiftList } from "../services/giftApi";

const GiftListBeforeView = () => {
	const [remainOpenCount, setRemainOpenCount] =
		useRecoilState(availableGiftsAtom);
	const refresh = useRecoilValue(giftListRefreshAtom); // refresh 플래그

	useEffect(() => {
		getGiftList("all");
	}, [refresh]);

	useEffect(() => {
		const getCanOpenGiftCount = async () => {
			try {
				const response = await countMyGiftBox();
				setRemainOpenCount(response.canOpenGiftCount);
			} catch (err) {
				console.log(err);
			}
		};

		getCanOpenGiftCount();
	}, [remainOpenCount, setRemainOpenCount]);

	return (
		<div>
			<div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden top-0">
				<div className="w-full md:max-w-sm h-[90px] px-4 pt-[14px] pb-[14px] bg-chocoletterPurpleBold flex-col justify-center items-center gap-[6px] inline-flex fixed top-0 z-50">
					<div className="self-stretch justify-between items-center inline-flex">
						<div className="w-6 h-6 justify-center items-center flex overflow-hidden">
							<GoBackMainMyButton />
						</div>
						<div className="text-center text-white text-2xl font-normal font-sans leading-snug">
							나의 초콜릿 박스
						</div>
						<div className="w-6 h-6" />
					</div>
					<div className="px-[15px] py-[5px] bg-black/40 rounded-[18px] justify-start items-center gap-1 inline-flex">
						<div className="text-center text-white text-sm font-normal font-sans leading-[18.20px]">
							현재 열어볼 수 있는 초콜릿 : {remainOpenCount}개
						</div>
					</div>
				</div>
				<GiftList filter={"all"} />
			</div>
		</div>
	);
};

export default GiftListBeforeView;
