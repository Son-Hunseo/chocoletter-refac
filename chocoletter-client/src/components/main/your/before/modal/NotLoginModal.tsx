import React from "react";
import send_icon from "../../../../../assets/images/main/send_icon.svg";
import not_login_send_button from "../../../../../assets/images/button/not_login_send_button.svg";
import Modal from "../../../../common/Modal";

interface NotLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const NotLoginModal: React.FC<NotLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div
        className="flex flex-col items-center px-2 py-1 text-base tracking-tight leading-none text-center text-black bg-white rounded-3xl"
        aria-labelledby="not-login-modal-title"
      >
        <div className="flex flex-col justify-center items-center w-full">
          {/* 상단 아이콘 */}
          <img src={send_icon} className="w-6 h-6 mb-4" alt="Send Icon" />

          {/* 메시지 */}
          <div id="not-login-modal-title" className="text-sm font-normal">
            로그인을 해야 초콜릿을 보낼 수 있어요!
          </div>

          {/* 로그인 버튼 */}
          <button onClick={onLogin} className="mt-6">
            <img src={not_login_send_button} alt="로그인 버튼" className="w-full h-auto" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotLoginModal;
