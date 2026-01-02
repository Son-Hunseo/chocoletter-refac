import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GoToMainMyEventButton from '../button/GoToMainMyEventButton';
import timerIcon from "../../../assets/images/unboxing/timer.svg";

interface OutVideoRoomModalProps {
    giftBoxId: string;
}

const OutVideoRoomModal = ({giftBoxId}: OutVideoRoomModalProps) => {
    const [remainTime, setRemainTime] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainTime((prev) => {
                if (prev === 1) {
                    navigate(`/main/${giftBoxId}`);
                    clearInterval(interval);
                    return 1;
                } else {
                    return prev - 1;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="w-[361px] h-[226px] px-[23px] py-5 bg-white rounded-[20px] border border-black flex-col justify-start items-center gap-6 inline-flex">
                <div className="w-7 h-7 justify-center items-center inline-flex">
                    <div className="w-7 h-7 relative flex-col justify-center items-center flex overflow-hidden" >
                        <img src={timerIcon} alt="타이머" className="w-full h-full absolute" />
                    </div>
                </div>
                <div className="flex-col justify-start items-center gap-[15px] flex">
                    <div className="text-center text-black text-lg font-normal font-sans leading-snug">화상채팅이 종료되었어요</div>
                    <div className="px-[15px] py-[5px] bg-chocoletterGiftBoxBg rounded-[18px] justify-start items-center gap-px inline-flex">
                        <div className="text-center text-[#5800be] text-[13px] font-normal font-pretendard leading-[18.20px]">{remainTime}초 후에 내 선물상자로 이동합니다</div>
                    </div>
                </div>
                <div className="justify-center items-center gap-[11px] inline-flex">
                    <div className="w-[267px] h-[45px] bg-chocoletterPurpleBold rounded-[15px] border border-black justify-center items-center gap-2 flex">
                        <GoToMainMyEventButton />
                    </div>
                </div>
            </div>
        </>
    )
}

export default OutVideoRoomModal;