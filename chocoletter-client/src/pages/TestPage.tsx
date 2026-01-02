import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  // 모든 경로 목록을 배열로 관리
  const routes = [
    { path: "/", label: "LoginView (/)" },
    { path: "/main/my/before", label: "MainMyBeforeView (/main/my/before)" },
    { path: "/main/your/before", label: "MainYourBeforeView (/main/your/before)" },
    { path: "/main/my/event", label: "MainMyEventView (/main/my/event)" },
    { path: "/main/my/after", label: "MainMyAfterView (/main/my/after)" },
    { path: "/gift-list/before", label: "GiftListBeforeView (/gift/list/before)" },
    { path: "/gift-list/event", label: "GiftListEventView (/gift/list/event)" },
    // { path: "/receive/2", label: "ReceiveView (/receive/2)" },
    { path: "/letter", label: "LetterView (/letter)" },
    { path: "/select-letter", label: "SelectLetterTypeView (/selectletter)" },
    { path: "/write/general", label: "WriteGeneralLetterView (/write/general)" },
    { path: "/write/question", label: "WriteQuestionLetterView (/write/question)" },
    { path: "/sent-gift", label: "SentGiftView (/sentgift)" },
    { path: "/select-gift", label: "SelectGiftTypeView (/selectgift)" },
    { path: "/video/waiting-room/12345", label: "WaitingRoomView (/video/waiting-room/12345)" },
    { path: "/video/waiting-room/67890", label: "WaitingRoomView (/video/waiting-room/67890)" },
    { path: "/video/room", label: "VideoRoomView (/video/room)" },
    { path: "/reset-time", label: "ResetTimeView (/reset-time)" },
    { path: "/set-time", label: "SetTimeView (/set-time)" },
    { path: "/rejected", label: "RejectedView (/rejected)" },
    { path: "/error", label: "ErrorPage (/error)" },
    { path: "/*", label: "Wildcard Route (/*) - ErrorPage" },
    { path: "/auth/kakao/callback", label: "KakaoLoginCallback (/auth/kakao/callback)" },
    // { path: "/receive/1", label: "ReceiveView (/receive/1)" },
    { path: "/gift/list/before", label: "MyBoxView (/gift/list/before)" },
    { path: "/gift/list/event", label: "MyBoxView (/gift/list/event)" },
    { path: "/chat/list", label: "ChatRoomListView (/chat/list)" },
    { path: "/my-box", label: "MyBoxView (/my-box)" },
    { path: "/video/13579", label: "VideoTest (/video/13579)"},
    { path: "/main/your/before", label: "MyBoxView (/main/your/before)" },
    { path: "/main/my/event", label: "MyBoxView (/main/my/event)" },
    { path: "/main/my/after", label: "MyBoxView (/main/my/after)" },
    { path: "/chat/room/9997", label: "ChatRoomView (/chat/room/9997)" },
  ];

  // 버튼 클릭 시 해당 경로로 이동
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-full-vh bg-gray-100 p-4">
      {/* 헤더 */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-hrtColorPink">테스트 해볼까요??</h1>
      </div>

      {/* 버튼 컨테이너 */}
      <div className="flex flex-wrap justify-center gap-4">
        {routes.map((route, index) => (
          <Button
            key={index}
            onClick={() => handleNavigation(route.path)}
            className="w-full sm:w-48 bg-white"
            aria-label={`Navigate to ${route.label}`}
          >
            {route.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
