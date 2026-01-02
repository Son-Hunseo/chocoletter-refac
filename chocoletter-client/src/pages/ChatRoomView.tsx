import React, { useState, useEffect, useRef } from "react";
import useViewportHeight from "../hooks/useViewportHeight";
import { useLocation, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { memberIdAtom } from "../atoms/auth/userAtoms";
import { getUserInfo } from "../services/userInfo";
import { Client } from "@stomp/stompjs";
import LetterInChatModal from "../components/chat-room/modal/LetterInChatModal";
import axios from "axios";
import clsx from "clsx";

import { GoBackButton } from "../components/common/GoBackButton";
import { ImageButton } from "../components/common/ImageButton";
import LetterInChatOpenButton from "../components/chat-room/button/LetterInChatOpenButton";
import send_icon from "../assets/images/main/send_icon.svg";
import { changeKSTDate } from "../utils/changeKSTDate";
import { getLetterInchat } from "../services/chatApi";
import { CgChevronDown } from "react-icons/cg";
import ChatHeader from "../components/chat-room/ChatHeader";
import ReactDOM from "react-dom";

interface MessageType {
  messageType: string;
  senderId: string | null;
  senderName: string | null;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface LetterData {
  type: "FREE" | "QUESTION";
  nickName: string;
  content: string;
  question: string;
  answer: string;
}

const ChatRoomView = () => {
  useViewportHeight();
  const location = useLocation();
  const { roomId } = useParams();
  const memberId = useRecoilValue(memberIdAtom);
  const userInfo = getUserInfo();

  // IME(한글 조합) 상태
  const [isComposing, setIsComposing] = useState(false);
  // 키보드 높이 및 열린 상태
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // ref: 텍스트 입력창, 채팅 스크롤 컨테이너, 최하단 스크롤용
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [placeholder, setPlaceholder] = useState("내용을 입력하세요");

  // 편지 및 채팅 메세지
  const [isOpenLetter, setIsOpenLetter] = useState(false);
  const [letter, setLetter] = useState<LetterData | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const stompClient = useRef<Client | null>(null);

  // 키보드 높이 감지
  useEffect(() => {
    const handleViewportResize = () => {
      const fullHeight = window.innerHeight;
      const viewportHeight = window.visualViewport?.height || fullHeight;
      const newKeyboardHeight = fullHeight - viewportHeight;
      if (newKeyboardHeight > 100) {
        setKeyboardHeight(newKeyboardHeight);
        setIsKeyboardOpen(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", handleViewportResize);
    handleViewportResize();
    return () => window.removeEventListener("resize", handleViewportResize);
  }, []);

  // 최하단 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  // 스크롤 이벤트 감지
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const isAtBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;
      setShowScrollButton(!isAtBottom);
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (event: React.CompositionEvent<HTMLTextAreaElement>) => {
    // 조합 종료 시 메시지 업데이트는 onChange 이벤트가 처리하므로 여기서는 플래그만 변경합니다.
    setIsComposing(false);
  };

  // 엔터 키 처리
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || isComposing) {
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (message.trim()) {
        sendMessage();
      }
    }
  };

  // 메시지 전송 (단 한 번 정의)
  const sendMessage = () => {
    if (!userInfo || !userInfo.accessToken) return;
    if (!stompClient.current || !stompClient.current.connected) return;
    if (stompClient.current && message.trim()) {
      const msgObject = {
        messageType: "CHAT",
        roomId: roomId,
        senderId: memberId,
        senderName: "none",
        content: message,
      };

      stompClient.current.publish({
        destination: `/app/send`,
        body: JSON.stringify(msgObject),
        headers: {
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      });

      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.blur();
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 10);
      }
    }
  };

  // 편지 불러오기
  useEffect(() => {
    const fetchLetter = async () => {
      try {
        if (!roomId) return;
        const data = await getLetterInchat(roomId);
        console.log("편지 내용 : ", data);
        setLetter(data);
      } catch (error) {
        console.error("편지지 불러오기 실패!", error);
      }
    };
    fetchLetter();
  }, [roomId]);

  // 기존 채팅 메시지 불러오기
  const fetchChatHistory = async () => {
    if (!roomId) return;
    try {
      const baseUrl = import.meta.env.VITE_CHAT_API_URL;
      const response = await axios.get(`${baseUrl}/api/v1/chat/${roomId}/all`);
      if (response.data.chatMessages && Array.isArray(response.data.chatMessages)) {
        setMessages(response.data.chatMessages.reverse());
      }
    } catch (error) {
      // console.error("기존 메시지 불러오기 실패!", error);
    }
  };

  // WebSocket STOMP 연결
  const connect = () => {
    if (!userInfo || !userInfo.accessToken) return;
    stompClient.current = new Client({
      brokerURL: import.meta.env.VITE_CHAT_WEBSOCKET_ENDPOINT,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${userInfo?.accessToken}`,
      },
      onConnect: () => {
        if (!stompClient.current || !stompClient.current.connected) return;
        const headers = {
          Authorization: `Bearer ${userInfo?.accessToken}`,
        };
        stompClient.current?.subscribe(
          `/topic/${roomId}`,
          (message) => {
            try {
              const newMessage = JSON.parse(message.body);
              if (newMessage.messageType) {
                if (newMessage.messageType === "CHAT") {
                  setMessages((prevMessages) => [...prevMessages, newMessage]);
                } else if (newMessage.messageType === "READ_STATUS") {
                  fetchChatHistory();
                }
              }
            } catch (error) {
              // console.error("메시지 JSON 파싱 오류:", error);
            }
          },
          headers
        );
      },
      onDisconnect: () => {
        // console.log("WebSocket 연결 해제됨");
      },
      onStompError: (error) => {
        // console.error("STOMP 오류 발생:", error);
      },
    });
    stompClient.current.activate();
  };

  // 채팅방 나가기
  const disconnect = async () => {
    try {
      const baseUrl = import.meta.env.VITE_CHAT_API_URL;
      await axios.post(`${baseUrl}/api/v1/chat/${roomId}/${memberId}/disconnect`);
      stompClient.current?.deactivate();
    } catch (error) {
      stompClient.current?.deactivate();
    }
  };

  // 웹소켓 연결 및 채팅 이력 불러오기
  useEffect(() => {
    if (!stompClient.current || !stompClient.current.connected) {
      connect();
    }
    fetchChatHistory();
    return () => {
      disconnect();
    };
  }, [roomId]);

  return (
    <>
      {/** 헤더를 document.body에 Portal로 렌더링 */}
      {ReactDOM.createPortal(
        <ChatHeader letterNickName={letter?.nickName} onOpenLetter={() => setIsOpenLetter(true)} />,
        document.body
      )}

      <div className="flex flex-col h-screen overflow-hidden">
        {/* 편지 모달 */}
        <LetterInChatModal
          isOpen={isOpenLetter}
          onClose={() => setIsOpenLetter(false)}
          nickName={letter?.nickName}
          content={letter?.content ?? ""}
          question={letter?.question ?? ""}
          answer={letter?.answer ?? ""}
        />

        {/* 채팅 본문 */}
        <div
          ref={chatContainerRef}
          className="flex-1 pt-16 pb-14 overflow-y-auto bg-chocoletterGiftBoxBg space-y-[15px]"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={clsx(
                "flex items-end mx-2",
                msg.senderId === memberId ? "justify-end" : "justify-start"
              )}
            >
              {msg.senderId !== memberId && (
                <div className="flex w-full gap-[5px]">
                  <div className="max-w-[200px] flex p-[10px_15px] rounded-r-[15px] rounded-bl-[15px] break-words bg-white border border-black">
                    <div className="text-sans text-[15px]">{msg.content}</div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="text-[12px] text-[#7F8087]">
                      {changeKSTDate({
                        givenDate: msg.createdAt.split(".")[0] + "Z",
                        format: "HH:mm",
                      })}
                    </div>
                  </div>
                </div>
              )}
              {msg.senderId === memberId && (
                <div className="flex w-full gap-[5px] justify-end">
                  <div className="flex flex-col justify-end items-end">
                    {!msg.isRead && (
                      <div className="text-[10px] text-red-500">1 {/* 읽지 않은 경우 표시 */}</div>
                    )}
                    <div className="text-[12px] text-[#7F8087]">
                      {changeKSTDate({
                        givenDate: msg.createdAt.split(".")[0] + "Z",
                        format: "HH:mm",
                      })}
                    </div>
                  </div>
                  <div className="max-w-[200px] flex p-[10px_15px] rounded-l-[15px] rounded-br-[15px] break-words border border-black bg-chocoletterPurpleBold text-white">
                    <div className="text-sans text-[15px]">{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* 최하단 이동 버튼 */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-[80px] right-3 bg-white text-black p-2 rounded-full shadow-md"
          >
            <CgChevronDown size={25} />
          </button>
        )}
        {/* 채팅 입력창 */}
        <div
          className="fixed inset-x-0 bottom-0 z-50 bg-[#F7F7F8] p-[5px_10px] gap-[15px] flex flex-row justify-between "
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 5px)",
          }}
        >
          <div className="flex items-center w-full bg-white rounded-full border border-gray-300 px-4 py-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onBlur={(e) => {
                setPlaceholder("내용을 입력하세요");
              }}
              placeholder="내용을 입력하세요"
              className="flex-1 outline-none placeholder-[#CBCCD1] text-[16px] resize-none h-[30px] text-left py-[5px] leading-[20px]"
            />
          </div>
          <ImageButton onClick={sendMessage} src={send_icon} className="w-[25px]" />
        </div>
      </div>
    </>
  );
};

export default ChatRoomView;
