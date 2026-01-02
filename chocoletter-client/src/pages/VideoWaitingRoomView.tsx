import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { sessionAtom, tokenAtom, memberCntAtom } from "../atoms/video/videoAtoms"
import { checkAuthVideoRoom } from "../services/openviduApi";

import { MyFaceInVideoWaitingRoom } from "../components/video-waiting-room/MyFaceInVideoWaitingRoom";
import timerIcon from "../assets/images/unboxing/timer.svg";
import callTerminate from "../assets/images/unboxing/call_terminate.svg";
import LetterInVideoModal from "../components/video-waiting-room/modal/LetterInVideoModal";
import LetterInVideoOpenButton from "../components/video-waiting-room/button/LetterInVideoOpenButton";
import classes from "../styles/videoRoom.module.css"

const waitingWords = ["대기중.", "대기중..", "대기중..."]

const WaitingRoomView = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { sessionIdInit } = useParams();
    const [isTimerOn, setIsTimerOn] = useState(true);
    const [remainTime, setRemainTime] = useState(600);
    const [makeMMSS, setMakeMMSS] = useState('');
    // const [isBothJoin, setIsBothJoin] = useState(0);
    const [isBothJoin, setIsBothJoin] = useRecoilState(memberCntAtom);

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

    // 방 참가 인원 API 요청 부분(예정)

    // video-room 연결 테스트
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트
    // token 동기화를 위해 localStorage 사용
    // useEffect(() => {
    //     const getRoomInfo = async (sessionIdInit: string) => {
    //         try {
    //             const response = await checkAuthVideoRoom(sessionIdInit);
    //             return response.data
    //         } catch (err) {
    //             console.log("API 통신 오류 : ", err)
    //         }
    //     } 

    //     if (sessionIdInit) {
    //         const inRoomData = getRoomInfo(sessionIdInit)
    //     } else {
    //         console.log("세션 값이 null입니다.")
    //     }
    // }, [])

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'isBothJoin' && event.newValue !== null && Number(event.newValue) > 1) {
                navigate('/video/room', { state: { sessionIdInit: sessionIdInit } });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate, sessionIdInit]);

    useEffect(() => {
        localStorage.setItem('isBothJoin', isBothJoin.toString());
        console.log('is', isBothJoin, 'and', sessionIdInit);
        const goView = async () => {
            if (isBothJoin >= 2) {
                console.log('here', sessionIdInit);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    if (!isIn) {return};
                    navigate('/video/room', { state: { sessionIdInit: sessionIdInit } });
                }, 10000);
            }
        };
        goView();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                console.log("꺼졌나요?")
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isBothJoin, isIn, navigate, sessionIdInit]);
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트

    // 0.5초마다 대기중 변경
    useEffect(() => {
        const interval = setInterval(() => {
            setWcomment(waitingWords[wcnt]);
            setWcnt((n) => (n + 1) % waitingWords.length);
        }, 500);

        return () => clearInterval(interval);
    }, [wcnt]);

    // 5분동안 타이머 및 지나면 방 폭파
    useEffect(() => {
        if (!isTimerOn) return;

        const interval = setInterval(() => {
            setRemainTime((time) => time - 1);
            setMakeMMSS(() => {
                if (remainTime >= 1) {
                    const minute = Math.floor(remainTime / 60);
                    const second = remainTime - minute * 60;
                    if (second <= 9) {
                        return `${minute}:0${second}`;
                    }
                    return `${minute}:${second}`;
                } else {
                    if (videoRef.current?.srcObject) {
                        const stream = videoRef.current.srcObject as MediaStream;
                        stream.getTracks().forEach(track => track.stop());
                    }
                    clearInterval(interval);
                    navigate('/main/my/event')
                    return '00:00';
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerOn, remainTime, navigate])

    const handleBackClick = () => {
        setIsIn(false);
        window.history.back(); // 브라우저 이전 페이지로 이동
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <LetterInVideoModal
                isOpen={isOpenLetter}
                onClose={hideRTCLetter}
                onErrorClose={hideRTCLetter}
                giftId=""
            />
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden">
                <MyFaceInVideoWaitingRoom videoRef={videoRef} />
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
                <div className="w-[11dvh] h-[11dvh] bottom-[10dvh] absolute bg-chocoletterWarning rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20">
                    <button onClick={handleBackClick} className="w-full h-full aspect-square flex justify-center items-center" >
                        <img src={callTerminate} alt="뒤로가기 버튼" className="w-[50%] h-[50%]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoomView;