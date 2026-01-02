import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Modal from "../../../../common/Modal";
import { fetchMyUnboxingSchedule } from "../../../../../services/unboxingApi";
import { toast } from "react-toastify";

const specialImages = import.meta.glob("../../../../../assets/images/chocolate/special/*.svg", {
  eager: true,
});
const specialChocos = Object.values(specialImages).map(
  (module) => (module as { default: string }).default
);

const EventMMDD = import.meta.env.VITE_EVENT_DAY

/** 일정 데이터 타입 정의 */
interface Schedule {
  nickName: string;
  unBoxingTime: string; // "HH:mm" 형식
  unboxingRoomId: string | null; // roomId 추가
  isAccept: boolean;
}

/** 더미 일정 데이터 */
const dummySchedules: Schedule[] = [
    { nickName: "Alice", unBoxingTime: "08:50", unboxingRoomId: "1", isAccept: true },
    { nickName: "Iso", unBoxingTime: "09:20", unboxingRoomId: "2", isAccept: false },
    { nickName: "Bob", unBoxingTime: "10:20", unboxingRoomId: "3", isAccept: false },
    { nickName: "Charlie", unBoxingTime: "14:30", unboxingRoomId: "4", isAccept: true },
    { nickName: "David", unBoxingTime: "16:50", unboxingRoomId: "5", isAccept: false },
    { nickName: "Eve", unBoxingTime: "19:00", unboxingRoomId: "6", isAccept: true },
    { nickName: "Andre", unBoxingTime: "19:20", unboxingRoomId: "7", isAccept: true },
    { nickName: "Bolt", unBoxingTime: "21:00", unboxingRoomId: "8", isAccept: false },
    { nickName: "Emily", unBoxingTime: "22:00", unboxingRoomId: "9", isAccept: true },
    { nickName: "Busto", unBoxingTime: "23:40", unboxingRoomId: "10", isAccept: false },
];

/** "HH:mm" 형식을 분(minute) 단위로 변환 */
function timeToMinute(time: string): number {
    const [HH, MM] = time.split(":").map(Number);
    return HH * 60 + MM;
}

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 내 언박싱 일정 확인 API(GET)
const GetMyUnboxingSchedule = async () => {
    try {
        const response = await fetchMyUnboxingSchedule();
        return response.myUnBoxingTimes;
    } catch (err) {
        console.log("내 언박스 일정 조회 실패 : ", err);
        return null;
    }
}

// 시간 설정 AM/PM
const ChangeAmPm = (strTime: string) => {
    const [hour, minute] = strTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Seoul'
    }).format(date)
}

// 시간 변환 함수
const convertToEventDate = (unBoxingTime: string, eventDay: string, timeZone: string = "Asia/Seoul"): Date => {
    const currentYear = new Date().getFullYear();
    const eventMonth = eventDay.substring(0, 2); // "02" (월)
    const eventDate = eventDay.substring(2, 4);  // "14" (일)
    const [hour, minute] = unBoxingTime.split(":").map(Number);

    // UTC 기준으로 Date 객체 생성 후, timeZone 적용
    const eventDateTime = new Date(currentYear, Number(eventMonth) - 1, Number(eventDate), hour, minute);

    // Intl.DateTimeFormat을 이용해 KST 변환
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24시간제
    });

    // 변환된 날짜를 다시 Date 객체로 변환 (KST 적용)
    const formattedDate = formatter.format(eventDateTime);
    return new Date(formattedDate);
};

// 5분 전 시간 계산 함수
const getFiveMinutesBefore = (eventDate: Date): Date => {
    const fiveMinutesBefore = new Date(eventDate.getTime() - 6 * 60 * 1000); // 6분
    return fiveMinutesBefore;
};

// 현재 시간
const CurrentTime = () => {
    // 현재 KST 시간 가져오기
    const now = new Date();
    const currentTimeKST = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(now);

    const nowKSTDate = new Date(currentTimeKST);
    return nowKSTDate;
};

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const navigate = useNavigate();

    // 일정 가져오기
    useEffect(() => {
        let isMounted = true;

        const fetchSchedule = async () => {
            if (!isOpen) return;
            
            const unboxingSchedule = await GetMyUnboxingSchedule();
            if (isMounted && unboxingSchedule) {
                setSchedules(unboxingSchedule);
            }
        };

        fetchSchedule();

        return () => {
        isMounted = false;
        };
    }, [isOpen]);

    // 더미 일정을 unboxingTime 기준 오름차순 정렬
    const sortedSchedules = useMemo(() => {
        if (schedules.length === 0) return [];
        return [...schedules].sort((a, b) => {
            const nowKST = CurrentTime();
            const eventA = convertToEventDate(a.unBoxingTime, EventMMDD, "Asia/Seoul");
            const eventB = convertToEventDate(b.unBoxingTime, EventMMDD, "Asia/Seoul");
        
            const isHiddenA = nowKST > eventA; // A가 지난 일정인지
            const isHiddenB = nowKST > eventB; // B가 지난 일정인지
        
            // 1️⃣ 지난 시간 (isHidden === true) → 맨 아래로 이동
            if (isHiddenA !== isHiddenB) return isHiddenA ? 1 : -1;
        
            // 2️⃣ 아직 지나지 않은 일정 (isHidden === false) → 오름차순 정렬
            if (!isHiddenA && !isHiddenB) {
                return timeToMinute(a.unBoxingTime) - timeToMinute(b.unBoxingTime);
            }
        
            // 3️⃣ 지난 일정 (isHidden === true) → 기존 시간 순서 유지 (오름차순 정렬)
            return timeToMinute(a.unBoxingTime) - timeToMinute(b.unBoxingTime);
        });
    }, [schedules]); // 여기 수정하고 merge

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-sm sm:max-w-lg md:max-w-xl max-h-[80vh] !bg-chocoletterLetterBgBlue"
        >
        <div className="flex flex-col w-full">
            {/* ChatRoomListView 스타일 헤더 */}
            <div className="w-full h-[30px] px-4 bg-chocoletterLetterBgBlue rounded-xl flex items-center justify-start">
            {/* 중앙: 제목 */}
            <div className="text-center text-nowrap text-black text-xl font-bold font-sans">발렌타인데이 일정</div>
            {/* 우측: 빈 공간 */}
            <div className="w-6 h-6"></div>
            </div>

            {/* 일정 목록 영역 */}
            <div className="w-full max-h-[60dvh] flex flex-col space-y-[15px] mt-4 ml-1 pb-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {sortedSchedules.length > 0 ? (
                sortedSchedules.map((item, index) => { 
                const RTCchocolate = specialChocos[Math.floor(Math.random() * specialChocos.length)];
                const eventKST = convertToEventDate(item.unBoxingTime, EventMMDD, "Asia/Seoul");
                const fiveBeforeKST = getFiveMinutesBefore(eventKST);
                const nowKST = CurrentTime();
                
                const nowUTC = new Date(Date.UTC(
                    new Date().getUTCFullYear(),
                    new Date().getUTCMonth(),
                    new Date().getUTCDate(),
                    new Date().getUTCHours(),
                    new Date().getUTCMinutes(),
                    new Date().getUTCSeconds()
                ));
                const beforeEventTimeUTC = new Date(Date.UTC(2025, 1, 13, 15, 0, 0));


                // 조건에 따라 버튼을 다르게 처리
                let buttonAction;
                let isHidden = false;
                let isAfter = false;


                if (nowUTC < beforeEventTimeUTC) {
                    if (item.isAccept) {
                        buttonAction = () => {
                            if (!toast.isActive("not-Dday-toast")) {
                                toast.error("2월 14일 해당되는 시간에 입장 가능합니다.", {
                                    toastId: "not-Dday-toast",
                                    position: "top-center",
                                    autoClose: 2000,
                                });
                            }
                        };
                    } else {
                        buttonAction = () => {
                            if (!toast.isActive("not-accepted-toast")) {
                                toast.error("아직 수락되지 않은 초대장입니다.", {
                                    toastId: "not-accepted-toast",
                                    position: "top-center",
                                    autoClose: 2000,
                                });
                            }
                        };
                        isAfter = true;
                    }
                } else {
                    if (nowKST > eventKST) {
                    // 이벤트 시간이 지난 경우 -> 버튼 숨기기
                    isHidden = true;
                    } else if (nowKST >= fiveBeforeKST) {
                    // 5분 전 ~ 이벤트 시간까지 -> navigate
                    if (item.unboxingRoomId) {
                        buttonAction = () => navigate(`/video/${item.unboxingRoomId}`);
                    } else {
                        buttonAction = () => {
                            if (!toast.isActive("no-room-toast")) {
                                toast.error("방 정보가 없습니다.", {
                                    toastId: "no-room-toast",
                                    position: "top-center",
                                    autoClose: 2000,
                                });
                            }
                        }
                    }
                    } else {
                    // 이벤트 시간이 아직 안 됨 -> toast 출력
                        buttonAction = () => { 
                            if (!toast.isActive("before-5minute-toast")) {
                                toast.error("5분 전부터 입장 가능합니다.", {
                                    toastId: "before-5minute-toast",
                                    position: "top-center",
                                    autoClose: 2000,
                                });
                            }
                        }
                    isAfter = true;
                    }
                }
                

                return(
                    <button 
                    key={`${item.nickName}-${index}`}
                    className={`active:opacity-80 transition ${
                        isHidden ? "opacity-40 pointer-events-none grayscale" : ""
                    } ${isAfter ? "opacity-40" : ""}`}
                    onClick={buttonAction}
                    >
                    <div className="relative w-[300px] shadow-[-102px_5px_5px_0px_rgba(0,0,0,0.2)] h-32 flex items-end">
                        {/* 왼쪽 초대장 스타일 배경 */}
                        <div className="w-2/3 h-full text-start bg-white text-chocoletterPurpleBold p-3 relative z-10" style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)" }}>
                        <div className="w-full h-full">
                            <h3 className="text-md font-bold font-sans">언박싱 초대장💌</h3>
                            <p className="text-gray-500 mt-2 font-sans max-w-full overflow-hidden whitespace-nowrap text-ellipsis">{item.nickName}님과 함께<br/>영상통화를 시작해보세요!</p>
                            <p className="text-sm mt-2 font-sans">{ChangeAmPm(item.unBoxingTime)}</p>
                        </div>
                        </div>
                        
                        {/* 오른쪽 아이콘 스타일 */}
                        <div className={`w-2/5 h-[calc(100%-15px)] mb-[2px] bg-chocoletterPurple flex items-center justify-center relative -ml-12 ${!isHidden ? "animate-slideWiggle" : ""} `} style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px"}}>
                        <img src={RTCchocolate} className="w-[60%] h-[60%]" />
                        </div>
                    </div>
                    </button>
                )})
            ) : (
                <div className="text-gray-300 text-sm text-center font-sans">일정이 없어요!</div>
            )}
            </div>
        </div>
        </Modal>
    );
};

export default CalendarModal;
