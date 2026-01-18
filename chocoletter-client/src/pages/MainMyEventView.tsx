import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";

import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import {
  giftBoxIdAtom,
  giftBoxNumAtom,
  isFirstLoginAtom,
  isFirstLoginEventAtom,
  isLoginAtom,
} from "../atoms/auth/userAtoms";

import giftbox_before_10 from "../assets/images/giftbox/giftbox_before_10.svg";
import giftbox_before_20 from "../assets/images/giftbox/giftbox_before_20.svg";
import giftbox_before_30 from "../assets/images/giftbox/giftbox_before_30.svg";
import giftbox_before_40 from "../assets/images/giftbox/giftbox_before_40.svg";
import giftbox_before_50 from "../assets/images/giftbox/giftbox_before_50.svg";
import giftbox_before_11 from "../assets/images/giftbox/giftbox_before_11.svg";
import giftbox_before_21 from "../assets/images/giftbox/giftbox_before_21.svg";
import giftbox_before_31 from "../assets/images/giftbox/giftbox_before_31.svg";
import giftbox_before_41 from "../assets/images/giftbox/giftbox_before_41.svg";
import giftbox_before_51 from "../assets/images/giftbox/giftbox_before_51.svg";
import giftbox_before_12 from "../assets/images/giftbox/giftbox_before_12.svg";
import giftbox_before_22 from "../assets/images/giftbox/giftbox_before_22.svg";
import giftbox_before_32 from "../assets/images/giftbox/giftbox_before_32.svg";
import giftbox_before_42 from "../assets/images/giftbox/giftbox_before_42.svg";
import giftbox_before_52 from "../assets/images/giftbox/giftbox_before_52.svg";

import { FaUserCircle } from "react-icons/fa";

import ChatModal from "../components/main/my/before/modal/ChatModal"; // ChatModal 임포트
import { FowardTutorialOverlay } from "../components/tutorial/FowardTutorialOverlay";

// === 프로필 드롭다운 내용
import MyPage from "../components/my-page/MyPage";

// === 뷰포트 높이 보정 훅 ===
import useViewportHeight from "../hooks/useViewportHeight";

// 이미지 리소스 예시
import giftbox_event_1 from "../assets/images/giftbox/giftbox_event_1.svg";
import Backdrop from "../components/common/Backdrop";
import tutorial_icon from "../assets/images/main/tutorial_icon.svg";
import chat_icon from "../assets/images/main/chat_icon.svg";
import open_text2 from "../assets/images/main/open_text2.svg";
import bell_icon from "../assets/images/main/bell_icon.svg";
import { countMyGiftBox, getGiftBoxName } from "../services/giftBoxApi";
import { getAlarmCount } from "../services/alarmApi";
import FirstLoginEventModal from "../components/main/your/before/modal/FirstLoginEventModal";
import Notification from "../components/main/my/before/modal/Notification";
import Loading from "../components/common/Loading";

const MainMyEventView: React.FC = () => {
  const navigate = useNavigate();

  // (1) 주소창 높이 보정 훅
  useViewportHeight();
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false); // 새로운 상태 추가
  const { giftBoxId: urlGiftBoxId } = useParams<{ giftBoxId?: string }>();
  const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);

  // Recoil 상태
  const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

  const giftBoxNum = useRecoilValue(giftBoxNumAtom);

  const giftBoxImages: { [key: number]: string } = {
    11: giftbox_before_10,
    21: giftbox_before_20,
    31: giftbox_before_30,
    41: giftbox_before_40,
    51: giftbox_before_50,
    12: giftbox_before_11,
    22: giftbox_before_21,
    32: giftbox_before_31,
    42: giftbox_before_41,
    52: giftbox_before_51,
    13: giftbox_before_12,
    23: giftbox_before_22,
    33: giftbox_before_32,
    43: giftbox_before_42,
    53: giftbox_before_52,
  };

  const isFirstLoginEvent = useRecoilValue(isFirstLoginEventAtom);
  const setIsFirstLoginEvent = useSetRecoilState(isFirstLoginEventAtom);

  // 로딩 상태들 (API 호출 또는 모달 전환 중)
  const [isAlarmCountLoading, setIsAlarmCountLoading] = useState<boolean>(false);
  const [isGiftShapeLoading, setIsGiftShapeLoading] = useState<boolean>(false);
  const [shapeNum, setShapeNum] = useState("12");
  const [isFirstLoginEventModalOpen, setIsFirstLoginEventModalOpen] = useState(false);

  const isLoading = isAlarmCountLoading || isGiftShapeLoading;

  // 튜토리얼 아이콘 ref
  const tutorialIconRef = useRef<HTMLButtonElement>(null);
  const watchOpenCountRef = useRef<HTMLDivElement>(null);
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const giftBoxRef = useRef<HTMLButtonElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);

  // 프로필 드롭다운 열림 여부
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // 새로운 상태 추가


  // 알림 개수 상태
  const [alarmCount, setAlarmCount] = useState<number>(0);

  useEffect(() => {
    if (!giftBoxNum || giftBoxNum === 0) {
      navigate("/select-giftbox");
    }
  }, [giftBoxNum, navigate]);

  // 핸들러들

  // 알림 아이콘 클릭 시 알림 모달을 여는 핸들러 (여기서는 모달 오픈 동작만 처리)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const tutorialIcons = useMemo(
    () => [
      tutorialIconRef,
      dummyRef,
      watchOpenCountRef,
      dummyRef,
      chatIconRef,
      dummyRef,
      giftBoxRef,
    ],
    []
  );

  const handleNotification = () => {
    setAlarmCount(0);
    setIsNotificationOpen(true);
  };

  const handleTutorial = () => {
    setIsTutorialModalOpen(true); // 튜토리얼 모달 열기
    // toast.info("튜토리얼 아이콘 클릭!");
  };


  const handleChat = () => {
    navigate("/chat/list");
  };

  // 프로필 드롭다운 토글
  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleMyChocolateBox = () => {
    navigate("/gift-list/event");
  };

  // useEffect(() => {
  // 	if (urlGiftBoxId && savedGiftBoxId) {
  // 		if (urlGiftBoxId !== savedGiftBoxId) {
  // 			console.warn(
  // 				"URL의 shareCode와 저장된 shareCode가 일치하지 않습니다."
  // 			);
  // 			navigate("/error");
  // 		}
  // 	} else if (!urlGiftBoxId && savedGiftBoxId) {
  // 		navigate(`/main/${savedGiftBoxId}`);
  // 	} else if (urlGiftBoxId && !savedGiftBoxId) {
  // 		console.warn(
  // 			"URL에 shareCode는 있으나 저장된 shareCode가 없습니다."
  // 		);
  // 		navigate("/error");
  // 	} else {
  // 		console.warn("shareCode 정보가 없습니다.");
  // 		navigate("/");
  // 	}
  // }, [urlGiftBoxId, savedGiftBoxId, navigate]);

  // 선물상자 이미지 API 호출
  useEffect(() => {
    async function fetchGiftShape() {
      setIsGiftShapeLoading(true);
      try {
        if (urlGiftBoxId) {
          const { name, type, fillLevel } = await getGiftBoxName(urlGiftBoxId);
          setShapeNum(String(type) + String(fillLevel));
        } else {
          throw new Error("Gift Box ID is undefined");
        }
      } catch (err) {
        console.error("Gift Box name API 실패:", err);
      } finally {
        setIsGiftShapeLoading(false);
      }
    }
    fetchGiftShape();
  }, [urlGiftBoxId, setIsGiftShapeLoading]);

  useEffect(() => {
    async function updateFirstLoginEvent() {
      const modalShown = localStorage.getItem("firstLoginEventShown");

      if (isFirstLoginEvent) {
        setIsFirstLoginEvent(false);
      }
      if (!modalShown) {
        // 모달을 한번만 보여줌
        setIsFirstLoginEventModalOpen(true);
        localStorage.setItem("firstLoginEventShown", "true");
      }
    }
    updateFirstLoginEvent();
  }, [isFirstLoginEvent, isFirstLoginEventModalOpen]);

  // 알림 개수 API 호출 (로딩 포함)
  useEffect(() => {
    async function fetchAlarmCount() {
      setIsAlarmCountLoading(true);
      try {
        const count = await getAlarmCount();
        setAlarmCount(count);
      } catch (err) {
        console.error("알림 개수 불러오기 실패:", err);
      } finally {
        setIsAlarmCountLoading(false);
      }
    }
    if (!isNotificationOpen) {
      fetchAlarmCount();
    }
  }, [isNotificationOpen]);

  return (
    <div className="relative">
      {/* 전역 로딩 오버레이 (로딩 중일 때만 표시) */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loading />
        </div>
      )}
      <div className="flex justify-center w-full bg-white">
        {/*
        메인 컨테이너:
        h-[calc(var(--vh)*100)]와 min-h-screen 병행
        + 그라디언트 배경
      */}
        {/* 더미 div  */}
        <div ref={dummyRef} className="w-0 h-0" />
        <div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
          {/** 상단 아이콘 바 (slide-in-bottom 애니메이션) */}
          <div className="mt-6 ml-6 flex items-center justify-between ">
            <div className="flex items-center gap-6">
              <button onClick={handleTutorial} ref={tutorialIconRef}>
                <img src={tutorial_icon} className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-6 mr-6">
              <div className="relative">
                {alarmCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-400 rounded-md h-3 w-[22px] flex items-center justify-center text-white text-xs font-light">
                    {alarmCount}
                  </div>
                )}
                <button onClick={handleNotification}>
                  <img src={bell_icon} className="w-7 h-7 mt-2" alt="notification icon" />
                </button>
              </div>

              <button onClick={handleChat} ref={chatIconRef}>
                <img src={chat_icon} className="w-6 h-6" />
              </button>
              <button onClick={handleProfile}>
                <FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
              </button>
            </div>
          </div>

          {/** 초콜릿 박스 & 안내 문구 */}
          <div className="mt-36 flex flex-col items-center px-4">
            <div className="flex justify-center gap-1.5 mb-3 w-[240px]">
              <img
                src={open_text2}
                alt="open_text2"
                style={{ width: "50%" }}
                className="heartbeat"
              />
            </div>
            <div className="heartbeat">
              <button
                onClick={handleMyChocolateBox}
                className="w-[255px] pl-8 flex items-center justify-center"
                ref={giftBoxRef}
              >
                <img
                  src={giftBoxImages[Number(shapeNum)]}
                  alt={`giftbox_before_${shapeNum}`}
                  className="p-2 max-h-60"
                />
              </button>
            </div>
          </div>

          {/*
          공유 안내 문구를
          "공유하기" 버튼 위에만 나타나도록 수정
          (위아래로 움직이는 애니메이션: shake-vertical)
        */}
          {/*
          공유 안내 문구를
          "공유하기" 버튼 위에만 나타나도록 수정
          (위아래로 움직이는 애니메이션: shake-vertical)
        */}

          {isProfileOpen && (
            <>
              <Backdrop onClick={() => setIsProfileOpen(false)} />
              <MyPage onClose={() => setIsProfileOpen(false)} />
            </>
          )}

          {/* 채팅 모달 */}
          <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />

          {/* 튜토리얼 모달 */}
          {isTutorialModalOpen && (
            <FowardTutorialOverlay
              targetRefs={tutorialIcons}
              onClose={() => setIsTutorialModalOpen(false)}
            />
          )}


          {isFirstLoginEventModalOpen && (
            <FirstLoginEventModal
              isOpen={isFirstLoginEventModalOpen}
              onClose={() => setIsFirstLoginEventModalOpen(false)}
            />
          )}

          <Notification isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default MainMyEventView;
