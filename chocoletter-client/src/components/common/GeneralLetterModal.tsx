import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import FocusLock from "react-focus-lock";
import question_icon from "../../assets/images/letter/question_icon.svg";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	nickName?: string;
	content?: string | null;
	question?: string | null;
	answer?: string | null;
}

const GeneralLetterModal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	nickName,
	content,
	question,
	answer,
}) => {
	// 편지 담을 state
	// const letter = "Sweet Valentine Letter";

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleBackdropClick = () => {
		onClose();
	};

	const handleContentClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // 모달 콘텐츠 클릭 시 백드롭 클릭 이벤트 방지
	};

	const bgColor = question
		? "bg-chocoletterLetterBgBlue"
		: "bg-chocoletterLetterBgPink";

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
			onClick={handleBackdropClick}
		>
			<FocusLock>
				<div
					className={`w-[clamp(340px,30dvh,400px)] h-[clamp(510px,65dvh,600px)] px-4 py-5 ${bgColor} rounded-[20px] border border-black flex flex-col justify-start items-center gap-[27px]`}
					onClick={handleContentClick}
				>
					{/* 닫기버튼 */}
					<div className="w-full flex justify-end">
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 focus:outline-none"
							aria-label="모달 닫기"
						>
							<FaXmark
								className="text-gray-500 text-opacity-50 hover:text-gray-200"
								size={24}
							/>
						</button>
					</div>

					{/* 메인 컨텐츠 */}
					<div className="w-full h-full flex flex-col justify-center items-center gap-[27px] ">
						{/* 문구 */}
						<div className="w-[250px] h-auto flex flex-col justify-center items-center">
							<div className="text-center text-black text-[24px] leading-8 tracking-[-0.5px]">
								{nickName}님이 정성 가득 담아 <br />
								보내주신 초콜릿이에요! 🍫
							</div>
						</div>

						{/* 편지내용 */}
						{question ? (
							// 랜덤 질문 편지
							<div className="w-full h-[calc(100%-6rem)] flex flex-col gap-[15px]">
								{/* 질문 */}
								<div className="w-fit min-w-[230px] max-w-[329px] p-[10px] flex flex-row bg-white rounded-[15px] gap-[10px] border-2 border-black">
									<img
										src={question_icon}
										alt="login_view_service_title"
										className="w-[24px]"
									/>
									<h1 className="inline-block font-sans text-[18px] leading-[22px] tracking-[-0.408px]">
										{question}
									</h1>
								</div>
								{/* 답변 */}
								<div className="w-full flex-1 p-5 bg-white rounded-[15px] border-2 border-dashed border-black">
									<div className="w-full h-full grow shrink basis-0 text-center text-chocoletterCharacter text-lg font-normal font-sans leading-normal overflow-y-auto">
										{answer}
									</div>
								</div>
							</div>
						) : (
							// 자유 형식 편지
							<div className="w-full h-[calc(100%-6rem)] p-5 bg-white rounded-[15px] border-2 border-dashed border-black">
								<div className="w-full h-full grow shrink basis-0 text-center text-chocoletterCharacter text-lg font-normal font-sans leading-normal overflow-y-auto">
									{content}
								</div>
							</div>
						)}
					</div>
				</div>
			</FocusLock>
		</div>
	);
};

export default GeneralLetterModal;
