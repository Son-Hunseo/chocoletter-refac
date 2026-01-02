import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { giftBoxIdAtom } from "../atoms/auth/userAtoms";
import { isGiftBoxSelectedAtom } from "../atoms/auth/userAtoms";
import MainMyBeforeView from "./MainMyBeforeView";
import MainMyEventView from "./MainMyEventView";
import MainMyAfterView from "./MainMyAfterView";
import MainYourBeforeView from "./MainYourBeforeView";
import SelectGiftBoxView from "./SelectGiftBoxView";
import MainYourEventView from "./MainYourEventView";

// 이벤트 날짜를 env 변수(VITE_EVENT_DAY="0214")에서 가져와 현재 연도의 Date 객체 반환 함수
const getEventDate = (): Date => {
	const raw = import.meta.env.VITE_EVENT_DAY || "0214";
	// raw가 "0214" 형식이면 앞의 두 자리는 월, 뒤의 두 자리는 일
	const month = Number(raw.slice(0, 2));
	const day = Number(raw.slice(2, 4));
	const currentYear = new Date().getFullYear();
	// JavaScript Date는 month가 0부터 시작하므로 month - 1
	return new Date(currentYear, month - 1, day);
};

const GiftBoxIdRouter: React.FC = () => {
	const navigate = useNavigate();

	const { giftBoxId: urlGiftBoxId } = useParams<{ giftBoxId?: string }>();
	const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);
	const isGiftBoxSelected = useRecoilValue(isGiftBoxSelectedAtom);

	const today = new Date();
	const eventDate = getEventDate();
	// 화이트데이는 이벤트 당일로부터 한 달 후 (예제에서는 3월 14일)
	const whiteDay = new Date(eventDate);
	whiteDay.setMonth(eventDate.getMonth() + 1);

	if (
		(urlGiftBoxId && savedGiftBoxId === "") ||
		urlGiftBoxId !== savedGiftBoxId
	) {
		if (today < eventDate) {
			return <MainYourBeforeView />;
		} else {
			return <MainYourEventView />;
		}
	}

	// 발신자: URL과 Recoil의 shareCode가 모두 존재하고 동일한 경우
	if (
		urlGiftBoxId &&
		savedGiftBoxId !== "" &&
		urlGiftBoxId === savedGiftBoxId
	) {
		if (!isGiftBoxSelected) {
			return <SelectGiftBoxView />;
		}

		if (today < eventDate) {
			return <MainMyBeforeView />;
		} else if (today.toDateString() === eventDate.toDateString()) {
			return <MainMyEventView />;
		} else {
			return <MainMyAfterView />;
		}
	} else {
		navigate("/");
	}
};

export default GiftBoxIdRouter;
