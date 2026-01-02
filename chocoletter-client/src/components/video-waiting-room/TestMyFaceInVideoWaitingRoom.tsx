import { VideoState } from "../../types/openvidutest";

interface MyFaceInVideoWaitingRoomProps {
    videoState: VideoState;
}

export const MyFaceInVideoWaitingRoom = ({ videoState }: MyFaceInVideoWaitingRoomProps) => {

    return (
        <div className="w-full min-h-screen relative">
            {videoState.publisher && (
                <video 
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover absolute"
                    ref={(el) => el && videoState.publisher?.addVideoElement(el)}
                />
            )}
        </div>
    );
};