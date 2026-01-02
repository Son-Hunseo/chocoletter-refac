import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import NotFixedUnboxingTime from "../components/receive/NotFixedUnboxingTime";
import RejectButton from "../components/receive/button/RejectButton";

// webRTC 일정 수락/거절 화면
function ReceiveView() {
	const navigate = useNavigate();
	const { giftId: strGiftId } = useParams<{ giftId: string }>(); //url에서 giftid 가져오기
	const giftId =
		strGiftId && !isNaN(Number(strGiftId)) ? Number(strGiftId) : null;

	const [time, setTime] = useState<string | null>(null);
	const [error, setError] = useState<boolean>(false);

	// giftId가 null인 경우와 에러인 경우 처리
	if (!giftId || error) {
		navigate("/error");
		return null;
	}

	return (
		<div className="relative flex flex-col items-center h-screen">
			<NotFixedUnboxingTime
				giftId={giftId}
				onTimeFetched={(fetchedTime, isError) => {
					setTime(fetchedTime);
					setError(isError);
				}}
			/>
			<div className="absolute mt-24">
				<h1 className="text-2xl font-bold mb-24">
					나에게 마음을 담은 <br />
					특별한 초콜릿이 도착했어요!
					<br />
					{time
						? `2월 14일 ${time}에 함께 열어보세요❣️`
						: "Loading..."}
				</h1>
				{/* 수락/거절 버튼 */}
				<div className="mb-8">
					<RejectButton giftId={giftId.toString()} />
				</div>
				<div className="mb-8">
					<RejectButton giftId={giftId.toString()} />
				</div>
			</div>
		</div>
	);
}
export default ReceiveView;
