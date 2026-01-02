import React from 'react';
import callTerminate from "../../../assets/images/unboxing/call_terminate.svg"

interface CloseVideoRoomButtonProps {
    onEnd: () => void;
}

const CloseVideoRoomButton: React.FC<CloseVideoRoomButtonProps> = ({ onEnd }) => {

    return (
        <>
            <button onClick={onEnd} className="w-full h-full aspect-square flex justify-center items-center">
                <img src={callTerminate} alt="통화 종료 버튼" className="w-[50%] h-[50%]" />
            </button>
        </>
    );
};

export default CloseVideoRoomButton;