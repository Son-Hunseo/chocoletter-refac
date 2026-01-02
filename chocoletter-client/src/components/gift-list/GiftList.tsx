import React, { useEffect, useState } from "react";
import { GiftOpenButton } from "./button/GiftOpenButton";
import { useFetchChocolates } from "../../hooks/useGetChocolates";
import { changeSpecialToGeneral } from "../../services/giftApi";
import Loading from "../common/Loading";
import { useRecoilValue } from "recoil";
import { giftListRefreshAtom } from "../../atoms/gift/giftAtoms";

// 초콜릿 더미 데이터
const dummyChocolates = [
	{
		giftId: "0",
		giftType: "GENERAL",
		isOpened: true,
		unBoxingTime: null,
		isAccept: false,
		unBoxingRoomId: null,
	},
	{ giftId: "1", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{
		giftId: "2",
		giftType: "SPECIAL",
		isOpened: false,
		unBoxingTime: "2025-02-03T08:50:00.000Z",
	},
	{ giftId: "3", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "4", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "5", giftType: "GENERAL", isOpened: true, unBoxingTime: null },
	{
		giftId: "6",
		giftType: "SPECIAL",
		isOpened: false,
		unBoxingTime: "2025-02-14T13:50:00.000Z",
	},
	{ giftId: "7", giftType: "GENERAL", isOpened: true, unBoxingTime: null },
	{ giftId: "8", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "9", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "10", giftType: "GENERAL", isOpened: true, unBoxingTime: null },
	{
		giftId: "11",
		giftType: "SPECIAL",
		isOpened: false,
		unBoxingTime: "2025-02-14T18:30:00.000Z",
	},
	{ giftId: "12", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "13", giftType: "GENERAL", isOpened: true, unBoxingTime: null },
	{
		giftId: "14",
		giftType: "SPECIAL",
		isOpened: false,
		unBoxingTime: "2025-02-14T11:40:00.000Z",
	},
	{ giftId: "15", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "16", giftType: "GENERAL", isOpened: true, unBoxingTime: null },
	{
		giftId: "17",
		giftType: "SPECIAL",
		isOpened: false,
		unBoxingTime: "2025-02-14T18:50:00.000Z",
	},
	{ giftId: "18", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{ giftId: "19", giftType: "GENERAL", isOpened: false, unBoxingTime: null },
	{
		giftId: "20",
		giftType: "SPECIAL",
		isOpened: false,
		unBoxingTime: "2025-02-14T19:00:00.000Z",
	},
];

type FilterType = "all" | "general" | "special";
interface GiftListProps {
	filter: FilterType;
}

export const GiftList: React.FC<GiftListProps> = ({ filter }) => {
    const [refresh, setRefresh] = useState(false);
	const { data: chocolates, isLoading } = useFetchChocolates("all", refresh);
	const [localChocolates, setLocalChocolates] = useState(chocolates);
	const currentTimeUTC = new Date().getTime() - 9 * 60 * 60 * 1000;

    const onChange = () => {
        setRefresh((prev) => !prev)
    }

	useEffect(() => {
		setLocalChocolates(chocolates);
	}, [refresh, chocolates]);

	useEffect(() => {
		const eventDay = import.meta.env.VITE_EVENT_DAY;
		const today = new Date();
		const formattedToday = `${String(today.getMonth() + 1).padStart(
			2,
			"0"
		)}${String(today.getDate()).padStart(2, "0")}`;

		// 테스트 동안 임시 주석임
		if (formattedToday !== eventDay) return;
		if (!chocolates) return;

		chocolates.map(async (choco) => {
			if (choco.giftType === "SPECIAL" && choco.unBoxingTime) {
				const unBoxingUTC =
					new Date(choco.unBoxingTime).getTime() - 9 * 60 * 60 * 1000 + 60 * 1000;
				console.log(choco.giftId, currentTimeUTC, unBoxingUTC);
				if (currentTimeUTC > unBoxingUTC) {
					try {
						const res = await changeSpecialToGeneral(choco.giftId);
						console.log(res);
						setLocalChocolates((prevChocos) =>
							prevChocos.map((item) =>
								item.giftId === choco.giftId
									? { ...item, giftType: "GENERAL" }
									: item
							)
						);
					} catch (err) {
						console.log("GiftList에서 변환 실패 : ", err);
					}
				}
			}
		});
	}, [refresh, chocolates]);

	if (isLoading) {
		return <Loading />; // 로딩 상태 표시
	}
	console.log(chocolates);

	const filteredChocolates = localChocolates.filter((choco) => {
		if (filter === "all") return true;
		return choco.giftType.toLowerCase() === filter;
	});

	return (
		<div>
			{filteredChocolates.length === 0 ? (
				<p className="text-sans text-center justify-center mt-[110px]">
					받은 초콜릿이 없어요...
				</p>
			) : null}
			<div
				className={`w-full grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden px-4 py-4 mt-[90px]`}
			>
				{/* api 연동 후 추가 수정 */}
				{filteredChocolates.map((chocolate) => (
					<GiftOpenButton
						key={chocolate.giftId}
						giftId={chocolate.giftId}
						giftType={chocolate.giftType}
						isOpened={chocolate.isOpened}
						unboxingTime={chocolate.unBoxingTime}
						isAccepted={chocolate.isAccept}
						roomId={chocolate.unBoxingRoomId}
                        onRefresh={onChange}
					/>
				))}
			</div>
		</div>
	);
};
