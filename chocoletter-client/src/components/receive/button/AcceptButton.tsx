import React from "react";
import { Button } from "../../common/Button";
import { useNavigate } from "react-router-dom";
import { patchUnboxingAccept } from "../../../services/unboxingApi";

// webRTC 초대창 수락 버튼

interface AcceptButtonProps {
	giftId: string;
	// accessToken: string;
}

const AcceptButton: React.FC<AcceptButtonProps> = ({ giftId }) => {
	const navigate = useNavigate();

	const clickAcceptHandler = async () => {
		try {
			const response = await patchUnboxingAccept(giftId);

			if (response) {
				navigate("/main/my/before");
			} else {
				alert("거절 요청 중 오류가 발생했습니다.");
			}
		} catch (err) {
			console.error("API 호출 중 에러 발생:", err);
		}
	};

	return (
		<div className="text-center">
			<Button
				onClick={clickAcceptHandler}
				className="w-[300px] h-[100px] bg-white"
			>
				와, 정말 기대돼요! <br />
				2월 14일에 함께 열어봐요 😊
			</Button>
		</div>
	);
};

export default AcceptButton;
