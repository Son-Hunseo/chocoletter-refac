import React from "react";
import { GoBackButton } from "../common/GoBackButton";
import LetterInChatOpenButton from "./button/LetterInChatOpenButton";

interface ChatHeaderProps {
	letterNickName?: string;
	onOpenLetter: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	letterNickName,
	onOpenLetter,
}) => {
	return (
		<div
			className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold gap-[15px]"
			style={{ paddingTop: `calc(env(safe-area-inset-top) + 17px)` }}
		>
			<div className="self-stretch justify-between items-center flex h-full">
				<div className="w-6 h-6 flex justify-center items-center">
					<GoBackButton />
				</div>
				<div className="text-center text-white text-2xl font-normal font-sans leading-snug">
					{letterNickName}
				</div>
				<div className="w-6 h-6">
					<LetterInChatOpenButton onPush={onOpenLetter} />
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;
