import React from "react";
import Modal from "../../../../common/Modal";
import { FaComments } from "react-icons/fa6";
import chat_icon from "../../../../../assets/images/main/chat_icon.svg";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const messages = [
    "서로 편지를 주고받은 사람과",
    "익명으로 대화할 수 있는 채팅방이 2월 14일에 열립니다."
    // "편지를 서로 주고받은 사람들끼리 대화를 할 수 있는",
    // "익명 채팅방이 2월 14일에 열립니다."
    // "그날을 더욱 특별하게 만들어 줄 채팅방이 열립니다.",
    // "'일반' 초콜릿을 주고받은 사람들끼리만",
    // "만날 수 있는 비밀스러운 공간이에요.",
    // "초콜릿과 함께 따뜻한 마음을 나누고,",
    // "2월 14일에 다 같이 모여 즐거운 시간을 보내요!",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div
        className="flex flex-col items-center px-4 py-2 text-base tracking-tight leading-none text-center text-black bg-white rounded-3xl"
        aria-labelledby="chat-modal-title"
      >
        <div className="flex flex-col justify-center items-center w-full">
          {/* 채팅 아이콘 */}
          <img src={chat_icon} className="w-6 h-6 mb-4" />

          {/* 제목 */}
          <div id="chat-modal-title" className="text-base font-medium">
            2월 14일, 특별한 방이 열려요.
            <br />
            우리, 그날 만나요!
          </div>

          {/* 메시지 목록 */}
          <div className="mt-4 space-y-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className="text-gray-400 whitespace-nowrap overflow-hidden text-sm wave-down"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {" "}
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
