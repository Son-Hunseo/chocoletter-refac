import { useState, useEffect } from 'react';
import checkPurple from "../../assets/images/chocolate/check_purple.svg";

interface UnboxingTimeStickerProps {
    isOpened: boolean;
}

export const UnboxingTimeSticker = ({ isOpened }: UnboxingTimeStickerProps) => {
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

    return (
        <div className="absolute inset-0 flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-lg pointer-events-none z-20">
            {content}
        </div>
    )
};