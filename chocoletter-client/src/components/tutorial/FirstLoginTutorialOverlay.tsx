import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../common/Button";

interface FirstLoginTutorialOverlayProps {
  /** 강조(구멍) 처리할 아이콘 버튼의 ref */
  targetRef: React.RefObject<HTMLButtonElement>;
  /** 닫기 콜백 */
  onClose: () => void;
}

/**
 * - 화면 전체를 어둡게 깔고, 아이콘 주변을 원형으로 오려(투명)서 아이콘만 보이게
 * - 아이콘 클릭은 막고, "알겠어요" 버튼으로만 오버레이 종료
 * - 반응형/스크롤/리사이즈 시에도 아이콘을 정확히 따라가도록 개선
 */
const FirstLoginTutorialOverlay: React.FC<FirstLoginTutorialOverlayProps> = ({
  targetRef,
  onClose,
}) => {
  /** 원형 구멍의 중심좌표(x,y), 반지름(radius) */
  const [circleInfo, setCircleInfo] = useState<{
    x: number;
    y: number;
    radius: number;
  } | null>(null);

  useLayoutEffect(() => {
    // 위치를 계산하는 함수
    const updatePosition = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();

      // 스크롤 보정
      const x = rect.left + rect.width / 2 + window.scrollX;
      const y = rect.top + rect.height / 2 + window.scrollY;
      // 아이콘보다 약간 크게 오려서 여유를 둠
      const radius = Math.max(rect.width, rect.height) / 2 + 8;

      setCircleInfo({ x, y, radius });
    };

    // 초기 계산
    updatePosition();

    // 스크롤 & 리사이즈 이벤트 발생 시 재계산
    window.addEventListener("resize", updatePosition);
    // capture: true → 자식 스크롤 전에도 업데이트 가능.
    // (필요에 따라 false로 변경해도 됨.)
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [targetRef]);

  if (!circleInfo) return null;

  const { x, y, radius } = circleInfo;

  /**
   * clip-path로 "전체 화면"에서 "원형 영역"만 빼고(투명 처리)
   *   1) 바깥 사각형: 화면 전체 (0,0 ~ 화면 너비/높이)
   *   2) 안쪽 원: circle around the icon
   *   3) clip-rule: evenodd (두 영역의 차집합을 클리핑)
   */
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // 원형 path: SVG 원 그리는 명령어
  const circlePath = [
    `M ${x - radius},${y}`,
    `a ${radius},${radius} 0 1,0 ${radius * 2},0`,
    `a ${radius},${radius} 0 1,0 -${radius * 2},0 Z`,
  ].join(" ");

  // 전체 사각형 + 원형
  const pathData = [
    `M 0,0 H ${screenW} V ${screenH} H 0 Z`, // 화면 전체
    circlePath, // 원형
  ].join(" ");

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      style={{
        // 오버레이가 전체 클릭을 막아서 아이콘 클릭도 막힘
        pointerEvents: "auto",
      }}
    >
      {/*
        (1) 검은 배경 레이어
        clip-path 로 아이콘 영역만 '오려냄'(투명)
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: screenW,
          height: screenH,
          background: "rgba(0,0,0,0.7)",
          clipPath: `path('${pathData}')`,
          clipRule: "evenodd",
          pointerEvents: "auto",
        }}
      />

      {/*
        (2) 반짝이는 테두리 효과(선택)
        - 구멍보다 약간 큰 원을 그려서 boxShadow
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: screenW,
          height: screenH,
          clipPath: `path('${makeHighlightPath(x, y, radius + 4)}')`,
          clipRule: "evenodd",
          boxShadow: "0 0 10px 5px rgba(255,255,255,0.8)",
          pointerEvents: "none", // 장식용
        }}
      />

      {/*
        (3) 안내 문구 & 닫기 버튼 (화면 중앙)
        pointerEvents: auto -> 버튼만 클릭 수용
      */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto",
        }}
        className="flex flex-col items-center text-center text-white"
      >
        <p className="mb-4">여기서 초코레터를 자세히 볼 수 있어요!</p>
        <Button onClick={onClose} className="text-md bg-white">
          알겠어요!
        </Button>
      </div>
      <div
        aria-label="튜토리얼 안내"
        style={{
          position: "absolute",
          top: y + radius + 5, // 아이콘과 텍스트를 고려하여 위치 조정
          left: x,
          transform: "translateX(-50%)",
          pointerEvents: "none", // 텍스트 클릭 방지
        }}
        className="text-xs text-white fade-in"
      >
        튜토리얼
      </div>
    </div>,
    document.body
  );
};

/** 반짝이용 경로를 만드는 헬퍼 함수 (구멍보다 살짝 큰 원) */
function makeHighlightPath(x: number, y: number, radius: number) {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  // 화면 전체 사각형
  const rect = `M 0,0 H ${screenW} V ${screenH} H 0 Z`;
  // 원
  const circle = [
    `M ${x - radius},${y}`,
    `a ${radius},${radius} 0 1,0 ${radius * 2},0`,
    `a ${radius},${radius} 0 1,0 -${radius * 2},0 Z`,
  ].join(" ");
  return [rect, circle].join(" ");
}

export default FirstLoginTutorialOverlay;
