import { RefObject, useEffect } from "react";

interface MyFaceInVideoWaitingRoomProps {
    videoRef: RefObject<HTMLVideoElement>;
}

export const MyFaceInVideoWaitingRoom = ({ videoRef }: MyFaceInVideoWaitingRoomProps) => {

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error("문제가 발생했습니다 : ", error);
            });

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                console.log("대기방 정리 함수 호출")
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="w-full min-h-screen relative">
            <video 
                ref={videoRef} 
                autoPlay={true}
                playsInline
                muted
                className="w-full h-full object-cover absolute"
                style={{ transform: "scaleX(-1)" }}
            />
        </div>
    );
};