import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsOpenGeneralGiftModal } from "../modal/IsOpenGeneralGiftModal";
import { ImageButton } from "../../common/ImageButton";
import { useRecoilState } from "recoil";
import { selectedGiftIdAtom } from "../../../atoms/gift/giftAtoms";
import outline_choco_button from "../../../assets/images/giftbox/outline_choco_button.svg";
import bg_choco_button from "../../../assets/images/giftbox/bg_choco_button.svg";
import { UnboxingTimeSticker } from "../UnboxingTimeSticker";

const generalImages = import.meta.glob(
	"../../../assets/images/chocolate/general/*.svg",
	{
		eager: true,
	}
);
const generalChocos = Object.values(generalImages).map(
	(module) => (module as { default: string }).default
);

interface GiftOpenButtonProps {
	giftLetterId: string;
	isOpened: boolean;
	onRefresh: () => void;
}

const getEventDate = (): Date => {
	const raw = import.meta.env.VITE_EVENT_DAY || "0214";
	// raw가 "0214" 형식이면 앞의 두 자리는 월, 뒤의 두 자리는 일
	const month = Number(raw.slice(0, 2));
	const day = Number(raw.slice(2, 4));
	const currentYear = new Date().getFullYear();
	// JavaScript Date는 month가 0부터 시작하므로 month - 1
	return new Date(currentYear, month - 1, day);
};

const compareDates = (current: Date, eventday: Date) => {
	if (
		current.getFullYear() === eventday.getFullYear() &&
		current.getMonth() === eventday.getMonth() &&
		current.getDate() === eventday.getDate()
	) {
		return true;
	}

	return false;
};

export const GiftOpenButton: React.FC<GiftOpenButtonProps> = ({
	giftLetterId,
	isOpened,
	onRefresh,
}) => {
	const [isNonOpen, setIsNonOpen] = useState(false);
	const navigate = useNavigate();
	const [atomGiftId, setAtomGiftId] = useRecoilState(selectedGiftIdAtom);

	const [buttonImage, setButtonImage] = useState("");
	const currentDate = new Date();

	// localStorage에서 이미지 로드
	useEffect(() => {
		const savedImage = localStorage.getItem(`giftImage_${giftLetterId}`);
		if (savedImage) {
			setButtonImage(savedImage);
		} else {
			const chocoRandomImage =
				generalChocos[Math.floor(Math.random() * generalChocos.length)];

			setButtonImage(chocoRandomImage);
			localStorage.setItem(`giftImage_${giftLetterId}`, chocoRandomImage);
		}
		console.log(giftLetterId, savedImage);
	}, []);

	const closeGeneralModal = () => {
		setIsNonOpen(false);
	};

	// 버튼 onClick 메서드
	const giftOpenButtonClickHandler = async () => {
		setAtomGiftId(giftLetterId);
		if (isOpened || compareDates(currentDate, getEventDate())) {
			navigate("/letter");
		} else {
			setIsNonOpen(true);
		}
	};

	return (
		<div className="relative w-[100px] h-full aspect-square rounded-lg flex items-center justify-center">
			<IsOpenGeneralGiftModal
				isOpen={isNonOpen}
				onClose={closeGeneralModal}
			/>
			<div
				className={`[&>button>img]:w-[55%] [&>button>img]:h-[55%] ${
					isNonOpen
						? "[&>button>img]:scale-125"
						: "[&>button>img]:hover:scale-125"
				}`}
			>
				<ImageButton
					src={buttonImage}
					onClick={giftOpenButtonClickHandler}
					className="absolute inset-0 w-full h-full aspect-square rounded-xl flex items-center justify-center z-10 bg-no-repeat"
				/>
			</div>
			<img
				src={bg_choco_button}
				alt="버튼 배경"
				className="absolute inset-0 w-full h-full pointer-events-none"
			/>
			<img
				src={outline_choco_button}
				alt="테두리"
				className="absolute inset-0 w-full h-full pointer-events-none z-30"
			/>
			<UnboxingTimeSticker isOpened={isOpened} />
		</div>
	);
};