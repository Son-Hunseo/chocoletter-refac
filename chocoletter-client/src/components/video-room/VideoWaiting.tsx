import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { memberCntAtom } from "../../atoms/video/videoAtoms"
import { GiftDetail } from "../../types/openvidutest";

import { MyFaceInVideoWaitingRoom } from "../../components/video-waiting-room/TestMyFaceInVideoWaitingRoom"
import timerIcon from "../../assets/images/unboxing/timer.svg";
import callTerminate from "../../assets/images/unboxing/call_terminate.svg";
import LetterInVideoModal from "../../components/video-waiting-room/modal/LetterInVideoModal";
import LetterInVideoOpenButton from "../../components/video-waiting-room/button/LetterInVideoOpenButton";
import classes from "../../styles/videoRoom.module.css"
import { VideoState } from "../../types/openvidutest";

const waitingWords = ["대기중.", "대기중..", "대기중..."]

interface WaitingRoomProps {
    unboxing: string,
    onEnd: () => void,
    isReady: boolean,
    isItThere: boolean,
    videoState: VideoState,
    trans: () => void,
    letterInfo?: GiftDetail | null,
    isOpenLetter: boolean,
    onErrorClose: () => void,
}

export const WaitingTest = ({ unboxing, onEnd, isReady, isItThere, videoState, trans, letterInfo, onErrorClose }: WaitingRoomProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [remainTime, setRemainTime] = useState(300);
    const [makeMMSS, setMakeMMSS] = useState('');

    const [isOpenLetter, setIsOpenLetter] = useState(false);
    const [wcomment, setWcomment] = useState(waitingWords[2]);
    const [wcnt, setWcnt] = useState(0);
    const [isIn, setIsIn] = useState(true);

    const navigate = useNavigate();

    const showRTCLetter = () => {
        setIsOpenLetter(true);
    }

    const hideRTCLetter = () => {
        setIsOpenLetter(false);
    }

    // 남은 시간 계산
    useEffect(() => {
        console.log("언박싱시간 : ", unboxing);
        const targetTime = new Date(unboxing);
        console.log("targetTime : ", targetTime);
        const targetUTC = new Date(targetTime.getTime() - 9 * 3600 * 1000 + 60 * 1000);
        
        const now = new Date();
        const nowUtc = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);

        const timeDiff = targetUTC.getTime() - nowUtc.getTime();
        console.log("현시간 : ",nowUtc, "언박싱시간 : ", targetUTC)

        const secondDiff = Math.floor(timeDiff / 1000);
        setRemainTime(secondDiff);
    }, [unboxing])

    // 5분동안 타이머
    useEffect(() => {
        timeoutRef.current = setInterval(() => {
            setRemainTime((time) => time - 1);
            setMakeMMSS(() => {
                const minute = Math.floor(remainTime / 60);
                const second = remainTime - minute * 60;
                if (second <= 9) {
                    return `${minute}:0${second}`;
                }
                return `${minute}:${second}`;
            });
        }, 1000);

        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [remainTime])

    // 5분 후 방 폭파
    useEffect(() => {
        if (remainTime <= 0 && !isItThere) {
            console.log("아쉽게도 연결이 안되었습니다.")
            onEnd();
        }
    }, [isItThere, remainTime, onEnd])

    // 0.5초마다 대기중 변경
    useEffect(() => {
        const interval = setInterval(() => {
            setWcomment(waitingWords[wcnt]);
            setWcnt((n) => (n + 1) % waitingWords.length);
        }, 500);

        return () => clearInterval(interval);
    }, [wcnt]);

    // const handleBackClick = () => {
    //     onSemiEnd();
    //     window.history.back(); // 브라우저 이전 페이지로 이동
    // };

    return (
        <div className="flex w-full justify-center items-center min-h-screen">
            {isOpenLetter &&
            (<LetterInVideoModal
                isOpen={isOpenLetter}
                onClose={hideRTCLetter}
                onErrorClose={onErrorClose}
                giftId={letterInfo?.giftId || ""}
            />)}
            
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden z-[9999]">
                <MyFaceInVideoWaitingRoom videoState={videoState} />
                <div className="w-full min-h-[193px] h-auto sm:h-[193px] top-0 bg-gradient-to-b from-chocoletterDarkBlue to-chocoletterLightPurple/1 z-10 absolute" />
                <div className="w-full h-[107px] px-3 top-[35px] absolute flex-col justify-start items-end gap-0.5 inline-flex">
                    <div className="w-8 h-8 z-10" >
                        <LetterInVideoOpenButton onPush={showRTCLetter} />
                    </div>
                    <div className="self-stretch h-[77px] flex flex-col justify-start items-center gap-[23px]">
                        <div className="self-stretch text-center text-white text-[40px] font-normal font-sans leading-snug z-20">{wcomment}</div>
                        <div className="px-[15px] py-[5px] bg-chocoletterGiftBoxBg rounded-[17px] justify-center items-center gap-[9px] inline-flex z-20">
                            <div className="w-[18px] h-[18px] relative">
                                <img src={timerIcon} alt="타이머" className={`w-[18px] h-[18px] left-0 top-0 absolute ${remainTime <= 10? classes.alarmIcon : ""}`} />
                            </div>
                            <div className={`text-center ${remainTime <= 10? "text-chocoletterWarning" : "text-chocoletterPurpleBold"} text-2xl font-normal font-sans leading-snug z-20`}>{makeMMSS}</div>
                        </div>
                    </div>
                </div>
                <div className={`w-[11dvh] h-[11dvh] bottom-[10dvh] absolute ${isReady? "bg-chocoletterGiftBg" : "bg-chocoletterGreen"} rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20`}>
                    {isReady ? 
                        (<div className="font-bold font-sans text-sm text-nowrap">상대방<br/>기다리는 중</div>) : 
                        (<button onClick={trans} className="w-full h-full aspect-square flex justify-center items-center" >
                            <p className="text-white text-center font-bold font-sans w-[50%] h-[50%] flex items-center justify-center text-2xl" >Ready</p>
                        </button>)
                    }
                </div>
            </div>
        </div>
    );
};