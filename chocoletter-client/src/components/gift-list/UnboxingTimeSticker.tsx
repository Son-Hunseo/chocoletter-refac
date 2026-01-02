import { useState, useEffect } from 'react';
import checkPurple from "../../assets/images/chocolate/check_purple.svg";

interface UnboxingTimeStickerProps {
    unboxingTime: string | null;
    giftType: string;
    isOpened: boolean;
    isAccepted?: boolean;
}

const formatTimeKST = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Seoul'
    }).format(date)
};

export const UnboxingTimeSticker = ({unboxingTime, giftType, isOpened, isAccepted}: UnboxingTimeStickerProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, [])
    
    const eventDay = import.meta.env.VITE_EVNET_DAY || "0214";
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currentMonthDay = month + day;

    let content = null;

    if (giftType === "GENERAL") {
        if (isOpened) {
            content = (
                <div className="absolute top-0 left-0 m-2">
                    <img src={checkPurple} alt="체크 아이콘" />
                </div>
            )
        } else {
            if (currentMonthDay !== eventDay) {
                content = (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 rounded-lg pointer-events-none">
                        <p className="font-sans text-white text-sm text-center font-bold">열어주길<br/>기다리는 중...</p>
                    </div>
                )
            }
        }

    } else {
        if (unboxingTime === null) return null;

        const unboxingTimeKST = unboxingTime.replace("Z", "+09:00");
        const unboxingDate = new Date(unboxingTimeKST);
        const unboxingMinusFive = new Date(unboxingDate.getTime() - 5 * 60 * 1000);

        if (currentDate < unboxingMinusFive) {
            if (isAccepted) {
                const formattedTime = formatTimeKST(unboxingDate);
                content = (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-500 bg-opacity-50 rounded-lg pointer-events-none">
                        <svg width="24" height="24" fill="currentColor" className="text-white">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                            <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                        <p className="font-sans text-white text-sm text-center mt-2">{formattedTime}</p>
                    </div>
                )
            } else {
                content = (
                    <div className="absolute inset-0 flex justify-center items-center bg-chocoletterRed/30 bg-opacity-50 rounded-lg pointer-events-none">
                        <p className="font-sans text-white text-sm text-center font-bold">시간수락<br/>기다리는 중...</p>
                    </div>
                )
            }
        } else {
            content = (
                <div className="absolute inset-0 flex justify-center items-center bg-chocoletterYellow bg-opacity-80 rounded-lg pointer-events-none">
                    <p className="font-sans text-chocoletterPurpleBold text-md font-bold text-nowrap text-center">영상통화<br/>연결</p>
                </div>
            )
        }
    }

    return (
        <div className="absolute inset-0 flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-lg pointer-events-none z-20">
            {content}
        </div>
    )
};