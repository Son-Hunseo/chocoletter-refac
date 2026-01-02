import React, { useEffect, useRef, useState } from "react";
import Backdrop from "../../../../common/Backdrop";
import { RiResetRightFill } from "react-icons/ri";
import Loading from "../../../../common/Loading";
import { Alarm, getAllAlarms } from "../../../../../services/alarmApi";
import {
	patchUnboxingAccept,
	patchUnboxingReject,
} from "../../../../../services/unboxingApi";
import AcceptRejectModal from "./AcceptRejectModal";

const getAlarmMessage = (alarm: Alarm): string => {
	switch (alarm.alarmType) {
		case "ACCEPT_SPECIAL":
			return `${alarm.partnerName}님께 보낸 영상통화 일정이 수락되었습니다.`;
		case "REJECT_SPECIAL":
			return `${alarm.partnerName}님께 보낸 영상통화 일정이 거절되었습니다.`;
		case "RECEIVE_SPECIAL":
			return "누군가가 영상통화를 요청했어요.\n일정을 확인하시겠어요?";
		case "UNBOXING_NOTICE":
			return `${alarm.partnerName}님과 함께하는 영상통화 일정 30분 전이에요.`;
		default:
			return "";
	}
};

// unBoxingTime이 ISO 형식(예: "2025-02-14T10:50")이므로, Date 객체로 파싱하여 시간 포맷팅
const ChangeAmPm = (isoString: string): string => {
	const date = new Date(isoString);
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
		timeZone: "Asia/Seoul",
	}).format(date);
};

// ChangeAmPm 결과를 분리해서 시간과 meridiem을 반환하는 헬퍼 함수
const formatTimeParts = (isoString: string) => {
	const formatted = ChangeAmPm(isoString); // 예: "10:00 AM"
	const parts = formatted.split(" ");
	return { time: parts[0], meridiem: parts[1] || "" };
};

interface NotificationProps {
	isOpen: boolean;
	onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
	const [alarms, setAlarms] = useState<Alarm[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);

	const fetchAlarms = async () => {
		setIsLoading(true);
		try {
			const data = await getAllAlarms();
			setAlarms(data);
		} catch (err) {
			new Error("알림 목록을 불러오는 중 오류 발생");
		} finally {
			setIsLoading(false);
		}
	};

	const dropdownRef = useRef<HTMLDivElement>(null);

	// Backdrop 클릭 시, AcceptRejectModal이 열려 있지 않을 때만 onClose 실행
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node) &&
				!selectedAlarm
			) {
				onClose();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose, selectedAlarm]);

	useEffect(() => {
		if (!isOpen) return;
		fetchAlarms();
	}, [isOpen]);

	// RECEIVE_SPECIAL 알림 클릭 시 처리 모달 표시
	const handleReceiveSpecialClick = (alarm: Alarm) => {
		setSelectedAlarm(alarm);
	};

	// 수락 처리: giftId가 존재할 경우 patchUnboxingAccept API 호출
	const handleAccept = async () => {
		if (selectedAlarm?.giftId == null) return;
		try {
			const result = await patchUnboxingAccept(selectedAlarm.giftId);
			setAlarms((prev) =>
				prev.filter((a) => a.alarmId !== selectedAlarm?.alarmId)
			);
			setSelectedAlarm(null);
		} catch (error) {
			new Error("수락 처리 중 에러 발생");
		}
	};

	// 거절 처리: giftId가 존재할 경우 patchUnboxingReject API 호출
	const handleReject = async () => {
		if (selectedAlarm?.giftId == null) return;
		try {
			const result = await patchUnboxingReject(selectedAlarm.giftId);
			setAlarms((prev) =>
				prev.filter((a) => a.alarmId !== selectedAlarm?.alarmId)
			);
			setSelectedAlarm(null);
		} catch (error) {
			new Error("거절 처리 중 에러 발생");
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<Backdrop
				onClick={() => {
					if (!selectedAlarm) onClose();
				}}
			/>
			{/* Notification 모달: 고정 모달 스타일 */}
			<div
				ref={dropdownRef}
				className="fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-4 bg-white shadow-lg rounded-xl z-50 w-80 max-w-md"
			>
				<div className="flex items-center justify-between mb-4">
					<div className="text-2xl font-bold text-black">
						초코레터 알림
					</div>
					<button
						onClick={fetchAlarms}
						className="text-sm hover:text-gray-300 focus:outline-none"
						aria-label="새로고침"
					>
						<RiResetRightFill />
					</button>
				</div>
				{/* 알림 목록 영역: 화면 높이의 50%만 보이도록 수정 */}
				<div
					className="w-full max-w-[95%] flex flex-col space-y-[15px] mt-4 ml-auto mr-auto pb-4 overflow-y-auto overflow-x-hidden"
					style={{ maxHeight: "50vh" }}
				>
					{isLoading ? (
						<p className="text-center text-gray-500 py-8">
							로딩중...
						</p>
					) : alarms.length === 0 ? (
						<p className="text-center text-gray-500 py-8">
							아직 새로운 알림이 없어요.
						</p>
					) : (
						alarms.map((alarm) => {
							// unBoxingTime이 있을 경우 ISO 문자열이 비어있지 않은지 확인 후 파싱
							let formattedTime = "";
							if (
								alarm.unBoxingTime &&
								alarm.unBoxingTime.trim() !== ""
							) {
								const { time, meridiem } = formatTimeParts(
									alarm.unBoxingTime
								);
								formattedTime = `${time} ${meridiem}`;
							}

							return (
								<div
									key={alarm.alarmId}
									// alarm.read가 true이고, 단 RECEIVE_SPECIAL이 아닌 경우에만 비활성화 스타일 적용
									className={`flex h-[71px] px-[20px] py-[10px] justify-between items-center rounded-[15px] border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] cursor-pointer ${
										alarm.read &&
										alarm.alarmType !== "RECEIVE_SPECIAL"
											? "active:opacity-80 transition opacity-40 pointer-events-none grayscale"
											: "bg-white"
									}`}
									onClick={() => {
										// 알림 항목 클릭 시 추가 기능(예: 상세보기) 구현 가능
									}}
								>
									{/* 왼쪽: 알림 메시지 및 약속 시각 */}
									<div className="flex flex-col">
										<p
											className="text-[12px] leading-[14px] font-semibold"
											style={{ whiteSpace: "pre-line" }}
										>
											{getAlarmMessage(alarm)}
										</p>
										{formattedTime && (
											<p className="font-[Pretendard] text-[12px] text-[#696A73]">
												일정 : 2월 14일 {formattedTime}
											</p>
										)}
									</div>
									{/* 오른쪽: RECEIVE_SPECIAL 알림일 경우 '확인' 버튼 표시 */}
									{alarm.alarmType === "RECEIVE_SPECIAL" && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleReceiveSpecialClick(
													alarm
												);
											}}
											className="w-1/5 h-[calc(100%px)] bg-opacity-70 hover:bg-chocoletterPurple py-6 left-5 shadow-[-3px_3px_3px_3px_rgba(0,0,0,0.1)] bg-chocoletterPurpleBold flex items-center justify-center relative -ml-4 rounded-tr-[14px] rounded-br-[14px] text-white text-sm font-bold"
										>
											확인
										</button>
									)}
								</div>
							);
						})
					)}
				</div>
			</div>
			{selectedAlarm && (
				<AcceptRejectModal
					alarm={selectedAlarm}
					onClose={() => setSelectedAlarm(null)}
					onAccept={handleAccept}
					onReject={handleReject}
				/>
			)}
		</>
	);
};

export default Notification;
