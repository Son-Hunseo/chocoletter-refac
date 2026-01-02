import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../common/Button";
import { TiArrowUpOutline } from "react-icons/ti";

interface PointTutorialOverlayProps {
    targetRef: React.RefObject<HTMLButtonElement>;
    onClose: () => void;
    onOpenTutorial: () => void;
}

export const PointTutorialOverlay: React.FC<PointTutorialOverlayProps> = ({
    targetRef,
    onClose,
    onOpenTutorial,
}) => {
    /** 원형 구멍의 중심좌표(x,y), 반지름(radius) */
    const [circleInfo, setCircleInfo] = useState<{
        x: number;
        y: number;
        radius: number;
    } | null>(null);
    const [arrowPos, setArrowPos] = useState<{ top: number; left: number; rotate: number } | null>(null);

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

            // 화살표 위치 설정 (안내문 → 버튼 방향)
            const arrowTop = rect.top * 2.7 + rect.height + window.scrollY; // 안내문은 화면 중앙
            const arrowLeft = rect.left + rect.width / 2 + window.scrollX;

            // 화살표 각도 계산 (안내문 → 튜토리얼 버튼 방향)
            const dx = x - arrowLeft;
            const dy = y - arrowTop;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            setArrowPos({ top: arrowTop, left: arrowLeft, rotate: angle });
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

    if (!circleInfo || !arrowPos) return null;

    const { x, y, radius } = circleInfo;
    const { top, left, rotate } = arrowPos;

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
            <div
                className="absolute rounded-full bg-chocoletterTextYellow opacity-75 animate-ping"
                style={{
                    width: radius * 2 + 10,
                    height: radius * 2 + 10,
                    top: y - radius - 5,
                    left: x - radius - 5,
                }}
            />
            <div
                className="absolute"
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    top: y - radius,
                    left: x - radius,
                    borderRadius: "100%",
                    pointerEvents: "auto", // 클릭 가능하도록 설정
                }}
                onClick={(e) => {
                    e.stopPropagation(); // 오버레이의 다른 클릭 이벤트 방지
                    onOpenTutorial(); // 튜토리얼 실행
                }}
            />
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
            <p className="mb-4 text-nowrap">여러분들의 의견을 반영한<br/><span className="text-chocoletterTextYellow">개선된 튜토리얼</span>을 만나보세요!</p>
            <Button onClick={onClose} className="text-md bg-white">
                나중에 보기
            </Button>
            </div>
            <div
                style={{
                    position: "absolute",
                    top: top,
                    left: left,
                    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                }}
            >
                <TiArrowUpOutline className="fill-chocoletterTextYellow stroke-1 stroke-white animate-reverseBounce" size={35} />
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