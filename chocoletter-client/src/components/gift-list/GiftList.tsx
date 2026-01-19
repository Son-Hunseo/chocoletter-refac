import React, { useEffect, useState } from "react";
import { GiftOpenButton } from "./button/GiftOpenButton";
import { useFetchChocolates } from "../../hooks/useGetChocolates";
import Loading from "../common/Loading";

export const GiftList: React.FC = () => {
    const [refresh, setRefresh] = useState(false);
	const { data: chocolates, isLoading } = useFetchChocolates(refresh);
	const [localChocolates, setLocalChocolates] = useState(chocolates);

    const onChange = () => {
        setRefresh((prev) => !prev)
    }

	useEffect(() => {
		setLocalChocolates(chocolates);
	}, [refresh, chocolates]);

	if (isLoading) {
		return <Loading />;
	}
	console.log(chocolates);

	return (
		<div>
			{localChocolates.length === 0 ? (
				<p className="text-sans text-center justify-center mt-[80px]">
					받은 초콜릿이 없어요...
				</p>
			) : null}
			<div
				className={`w-full grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden px-4 py-4 mt-[60px]`}
			>
				{localChocolates.map((chocolate) => (
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
