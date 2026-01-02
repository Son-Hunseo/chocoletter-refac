import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";

import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import {
  isFirstLoginAtom,
  giftBoxNumAtom,
  giftBoxIdAtom,
  isWatchNewTutorialAtom,
} from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import ShareModal from "../components/main/my/before/modal/ShareModal";
import CaptureModal from "../components/main/my/before/modal/CaptureModal";
import FirstLoginTutorialOverlay from "../components/tutorial/FirstLoginTutorialOverlay";
import ChatModal from "../components/main/my/before/modal/ChatModal";
import TutorialModal from "../components/main/my/before/modal/TutorialModal";
import { FowardTutorialOverlay } from "../components/tutorial/FowardTutorialOverlay";

import MyPage from "../components/my-page/MyPage";
import useViewportHeight from "../hooks/useViewportHeight";

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

import Backdrop from "../components/common/Backdrop";
import share_button from "../assets/images/button/share_button.svg";
import { ImageButton } from "../components/common/ImageButton";
import capture_button_kor from "../assets/images/button/capture_button_kor.svg";
import tutorial_icon from "../assets/images/main/tutorial_icon.svg";
import chat_icon from "../assets/images/main/chat_icon.svg";
import choco_asset from "../assets/images/main/choco_asset.svg";
import tool_tip from "../assets/images/main/tool_tip.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";
import bell_icon from "../assets/images/main/bell_icon.svg";
import calendar_icon from "../assets/images/main/calendar_icon.svg";
import click_text from "../assets/images/main/click_text.svg";

import CalendarModal from "../components/main/my/before/modal/CalendarModal";
import { countMyGiftBox } from "../services/giftBoxApi";
import { getAlarmCount } from "../services/alarmApi";
import { getGiftBoxName } from "../services/giftBoxApi";

import Notification from "../components/main/my/before/modal/Notification";

import Loading from "../components/common/Loading";
import ValentineDayCountdownModal from "../components/main/my/before/popup/ValentineDayCountdownModal";
import { PointTutorialOverlay } from "../components/tutorial/PointTutorialOverlay";
import { useCookies } from "react-cookie";

const MainMyBeforeView: React.FC = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies(["valentineCountdownShown"]);
  const todayStr = new Date().toISOString().split("T")[0];
  const [IsPopupOpen, setIsPopupOpen] = useState(
    cookies.valentineCountdownShown === todayStr ? false : true
  );

  const { giftBoxId: urlGiftBoxId } = useParams<{ giftBoxId?: string }>();
  const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);
  const giftBoxNum = useRecoilValue(giftBoxNumAtom);
  const [shapeNum, setShapeNum] = useState("12");

  useViewportHeight();

  const availableGifts = useRecoilValue(availableGiftsAtom);
  const receivedGifts = useRecoilValue(receivedGiftsAtom);
  const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

  const setAvailableGifts = useSetRecoilState(availableGiftsAtom);
  const setReceivedGifts = useSetRecoilState(receivedGiftsAtom);

  const [isWatchNewTutorial, setIsWatchNewTutorial] = useRecoilState(isWatchNewTutorialAtom);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCaptureModalVisible, setIsCaptureModalVisible] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const [captureModalKey, setCaptureModalKey] = useState(0);

  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const tutorialIconRef = useRef<HTMLButtonElement>(null);
  const watchOpenCountRef = useRef<HTMLDivElement>(null);
  const calendarIconRef = useRef<HTMLButtonElement>(null);
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const giftBoxRef = useRef<HTMLButtonElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const [alarmCount, setAlarmCount] = useState<number>(0);

  const [isGiftCountLoading, setIsGiftCountLoading] = useState<boolean>(false);
  const [isAlarmCountLoading, setIsAlarmCountLoading] = useState<boolean>(false);
  const [isGiftShapeLoading, setIsGiftShapeLoading] = useState<boolean>(false);

  const isLoading = isGiftCountLoading || isAlarmCountLoading || isGiftShapeLoading;

  useEffect(() => {
    if (!giftBoxNum || giftBoxNum === 0) {
      navigate("/select-giftbox");
    }
  }, [giftBoxNum, navigate]);

  useEffect(() => {
    if (urlGiftBoxId && savedGiftBoxId) {
      if (urlGiftBoxId !== savedGiftBoxId) {
        navigate("/error");
      }
    } else if (!urlGiftBoxId && savedGiftBoxId) {
      navigate(`/main/${savedGiftBoxId}`);
    } else if (urlGiftBoxId && !savedGiftBoxId) {
      navigate("/error");
    } else {
      navigate("/");
    }
  }, [urlGiftBoxId, savedGiftBoxId, navigate]);

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

  const tutorialIcons = useMemo(
    () => [
      tutorialIconRef,
      dummyRef,
      watchOpenCountRef,
      calendarIconRef,
      dummyRef,
      chatIconRef,
      dummyRef,
      giftBoxRef,
    ],
    []
  );

  // 핸들러들
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCapture = () => {
    setCaptureModalKey((prev) => prev + 1);
    setIsCaptureModalVisible(true);
  };

  const handleTutorial = () => {
    setIsTutorialModalOpen(true);
  };

  const handleCalendar = () => {
    setIsCalendarModalOpen(true);
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNotification = () => {
    setAlarmCount(0);
    setIsNotificationOpen(true);
  };

  const handleChat = () => {
    setIsChatModalOpen(true);
  };

  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleMyChocolateBox = () => {
    navigate("/gift-list/before");
  };

  useEffect(() => {
    async function fetchGiftShape() {
      setIsGiftShapeLoading(true);
      try {
        if (urlGiftBoxId) {
          const { name, type, fillLevel } = await getGiftBoxName(urlGiftBoxId);
          setShapeNum(String(type) + String(fillLevel));
        } else {
          throw new Error("Gift Box ID가 없어요!");
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
    async function fetchGiftCount() {
      setIsGiftCountLoading(true);
      try {
        const { giftCount, canOpenGiftCount } = await countMyGiftBox();
        setAvailableGifts(canOpenGiftCount);
        setReceivedGifts(giftCount);
      } catch (err) {
        console.error("Gift Box count API 실패:", err);
      } finally {
        setIsGiftCountLoading(false);
      }
    }
    fetchGiftCount();
  }, [setAvailableGifts, setReceivedGifts]);

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
      {/* 더미 div  */}
      <div ref={dummyRef} className="w-0 h-0" />
      {/* 디데이 카운트 팝업창 */}
      <ValentineDayCountdownModal isOpen={IsPopupOpen} onClose={() => setIsPopupOpen(false)} />

      <div className="flex justify-center w-full bg-white">
        <div className="w-full sm:max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
          {/* 상단 아이콘 바 */}
          <div className="mt-5 ml-6 flex items-center justify-between ">
            <div className="flex items-center gap-6">
              <button onClick={handleTutorial} ref={tutorialIconRef}>
                <img src={tutorial_icon} className="w-6 h-6" alt="tutorial icon" />
              </button>
              <button onClick={handleCalendar} ref={calendarIconRef}>
                <img src={calendar_icon} className="w-7 h-7" alt="calendar icon" />
              </button>
            </div>

            <div className="flex items-center gap-6 mr-6 relative">
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
                <img src={chat_icon} className="w-6 h-6" alt="chat icon" />
              </button>
              <button onClick={handleProfile}>
                <FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
              </button>
            </div>
          </div>

          {/* 초콜릿 개봉/받은 정보 컨테이너 */}
          <div
            className="mt-6 mx-auto relative flex items-center justify-center"
            style={{
              backgroundImage: `url(${my_count_background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "74%",
              aspectRatio: "258/96",
            }}
            ref={watchOpenCountRef}
          >
            <div className="flex flex-col items-center gap-2.5 px-6 py-4 relative">
              <div className="flex flex-row w-full truncate">
                <span className="text-xl font-normal text-center text-black truncate">
                  미리 열어볼 수 있는&nbsp;
                </span>
                <object data={choco_asset} type="image/svg+xml" className="w-7 h-7">
                  <img src={choco_asset} alt="choco asset fallback" />
                </object>
                <span className="text-xl font-normal text-center text-gray-200 truncate">
                  &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                </span>
                <span className="text-xl font-normal text-center text-chocoletterPurpleBold truncate">
                  {availableGifts}
                </span>
                <span className="text-xl font-normal text-center text-gray-500 truncate">
                  &nbsp;개
                </span>
              </div>
              <div className="flex flex-row w-full truncate justify-center items-center">
                <span className="text-sm text-gray-300 text-center truncate">
                  지금까지 받은&nbsp;
                </span>
                <object data={choco_asset} type="image/svg+xml" className="w-4 h-4 flex-shrink-0">
                  <img src={choco_asset} alt="choco asset fallback" />
                </object>
                <span className="text-sm text-gray-200 text-center truncate">
                  &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span className="text-sm text-center text-gray-400 truncate">{receivedGifts}</span>
                <span className="text-sm text-gray-300 text-center truncate">&nbsp;개</span>
              </div>
            </div>
          </div>
          {/* 초콜릿 박스 & 클릭 이미지 */}
          <div className="mt-6 flex flex-col items-center px-4">
            <div className="flex justify-center gap-1.5 mb-3 w-[225px]">
              <img
                src={click_text}
                alt="click_text"
                style={{ width: "35%" }}
                className="heartbeat"
              />
            </div>
            <div ref={captureRef} id="capture-target" className="heartbeat">
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
          {/* 공유 및 캡처 버튼 영역 */}
          <div className="mt-14 px-4 flex flex-row justify-center items-center gap-2.5">
            <div className="relative group">
              <div className="absolute bottom-full mb-1 left-4 w-max">
                <img src={tool_tip} alt="tooltip" />
              </div>
              <ImageButton
                onClick={handleShare}
                src={share_button}
                className="flex h-14 w-[270px] items-center justify-center hover:bg-chocoletterPurple rounded-[15px] border border-black group"
              />
            </div>
            <ImageButton
              onClick={handleCapture}
              src={capture_button_kor}
              className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
            />
          </div>

          {/* 모달 및 오버레이 */}
          <CaptureModal
            key={captureModalKey} // key 추가
            isVisible={isCaptureModalVisible}
            onClose={() => setIsCaptureModalVisible(false)}
          />
          <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
          {isFirstLogin && (
            <FowardTutorialOverlay
              targetRefs={tutorialIcons}
              onClose={() => {
                setIsWatchNewTutorial(true);
                setIsFirstLogin(false);
              }}
            />
          )}
          {isProfileOpen && (
            <>
              <Backdrop onClick={() => setIsProfileOpen(false)} />
              <MyPage onClose={() => setIsProfileOpen(false)} />
            </>
          )}
          <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
          {isTutorialModalOpen && (
            <FowardTutorialOverlay
              targetRefs={tutorialIcons}
              onClose={() => setIsTutorialModalOpen(false)}
            />
          )}
          <CalendarModal
            isOpen={isCalendarModalOpen}
            onClose={() => setIsCalendarModalOpen(false)}
          />
          <Notification isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
          {!isFirstLogin && !isWatchNewTutorial && (
            <PointTutorialOverlay
              targetRef={tutorialIconRef}
              onClose={() => setIsWatchNewTutorial(true)}
              onOpenTutorial={() => {
                setIsWatchNewTutorial(true);
                setIsTutorialModalOpen(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMyBeforeView;
