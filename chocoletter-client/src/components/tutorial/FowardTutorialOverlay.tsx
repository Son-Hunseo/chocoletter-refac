import React, { useLayoutEffect, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ImageButton } from "../common/ImageButton";
import ok_button from "../../assets/images/button/ok_button.svg";
import chatlist_ex from "../../assets/images/tutorial/chatlist_ex.svg"
import sharemodal_ex from "../../assets/images/tutorial/sharemodal_ex.svg"
// import click_text from "../../assets/images/main/click_text.svg";
// import giftbox_before_12 from "../../assets/images/giftbox/giftbox_before_12.svg";
import { FiArrowUpCircle } from "react-icons/fi";
import share_button from "../../assets/images/button/share_button.svg";
import start_button from "../../assets/images/button/start_button.svg";
import prev_choco from "../../assets/images/tutorial/prev_choco.svg";

interface FowardTutorialOverlayProps {
    /** 강조(구멍) 처리할 아이콘 버튼의 ref */
    targetRefs: React.RefObject<HTMLButtonElement | HTMLDivElement | null>[];
    /** 닫기 콜백 */
    onClose: () => void;
}

/**
 * - 화면 전체를 어둡게 깔고, 아이콘 주변을 원형으로 오려(투명)서 아이콘만 보이게
 * - 아이콘 클릭은 막고, "알겠어요" 버튼으로만 오버레이 종료
 * - 반응형/스크롤/리사이즈 시에도 아이콘을 정확히 따라가도록 개선
 */
export const FowardTutorialOverlay: React.FC<FowardTutorialOverlayProps> = ({
    targetRefs,
    onClose,
}) => {
    const [page, setPage] = useState(0);
    const [targetRef, setTargetRef] = useState<
        React.RefObject<HTMLButtonElement | HTMLDivElement | null>
    >({ current: null });
    const nextPage = () => {
        setPage(page + 1);
        setTargetRef(targetRefs[page + 1]);
    }
    /** 원형 구멍의 중심좌표(x,y), 반지름(radius) */
    const [circleInfo, setCircleInfo] = useState<{
        x: number;
        y: number;
        radius: number;
    } | null>(null);

    useEffect(() => {
        if (targetRefs.length > 0 && targetRefs[0].current) {
            setTargetRef(targetRefs[0]);
        }
    }, [targetRefs]);

    useLayoutEffect(() => {
        // 위치를 계산하는 함수
        const updatePosition = () => {
        if (!targetRef || !targetRef.current) return;
        const rect = targetRef.current.getBoundingClientRect();

        // 스크롤 보정
        let x = rect.left + rect.width / 2 + window.scrollX;
        let y = rect.top + rect.height / 2 + window.scrollY;
        // 아이콘보다 약간 크게 오려서 여유를 둠
        let radius = Math.max(rect.width, rect.height) / 2 + 8;
        if ([2, 3].includes(page)) {
            radius = 0;
        }
        // 5번째 페이지(시작하기): 화면 중앙 선물함을 가리키는 큰 원
        if (page === 4) {
            x = window.innerWidth / 2;
            y = window.innerHeight * 0.55;
            radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
        }
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
    const rectWidth = radius * 2;
    const rectHeight = radius * 0.8;

    // 원형 path: SVG 원 그리는 명령어
    const circlePath = [
            `M ${x - radius},${y}`,
            `a ${radius},${radius} 0 1,0 ${radius * 2},0`,
            `a ${radius},${radius} 0 1,0 -${radius * 2},0 Z`,
        ].join(" ");

        const startX = x - rectWidth / 2;
        const startY = y - rectHeight / 2;
        
        // 수평 길이와 수직 길이
        const horizontalLength = rectWidth;
        const verticalLength = rectHeight;
        
        const roundedRectPath = [
            `M ${startX},${startY}`,               // 시작점: 좌측 상단 (borderRadius offset 적용)
            `h ${horizontalLength}`,              // 상단 가로선
            // `q ${borderRadius},0 ${borderRadius},${borderRadius}`,  // 우측 상단 곡선
            `v ${verticalLength}`,                // 우측 세로선
            // `q 0,${borderRadius} -${borderRadius},${borderRadius}`, // 우측 하단 곡선
            `h -${horizontalLength}`,             // 하단 가로선
            // `q -${borderRadius},0 -${borderRadius},-${borderRadius}`,// 좌측 하단 곡선
            `v -${verticalLength}`,               // 좌측 세로선
            // `q 0,-${borderRadius} ${borderRadius},-${borderRadius}`, // 좌측 상단 곡선
            'Z'
        ].join(" ");

    const shapePaths = [
        circlePath,
        roundedRectPath,
        circlePath,
        roundedRectPath,
        circlePath,
    ]

    // 전체 사각형 + 원형
    const pathData = [
        `M 0,0 H ${screenW} V ${screenH} H 0 Z`, // 화면 전체
        shapePaths[page],
    ].join(" ");

    const contents = [
        (<div
            style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            }}
            className="flex flex-col items-center text-center text-white text-nowrap"
        >
            <p className="mb-4">여기서 <span className="text-chocoletterTextYellow">초코레터</span>를 자세히 볼 수 있어요!</p>
        </div>),
        (<div
            style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            }}
            className="flex flex-col items-center text-center text-white text-nowrap"
        >
            <div className="mb-[10dvh]">
                <img src={prev_choco} alt="미리 열기" />
            </div>
            <p className="mb-4">모든 편지는 2월 14일에 열어볼 수 있지만,<br/> 2월 14일 전에 열어볼 수도 있어요!</p>
            <p className="mb-4">친구들에게 초콜릿을 <span className="text-chocoletterTextYellow">2개</span> 받을 때마다,<br/> 미리 열어볼 수 있는 기회를 <span className="text-chocoletterTextYellow">1개씩</span> 드립니다!</p>
            <p className="mb-4"><span className="text-chocoletterTextYellow">처음에 미리 열어볼 수 있는 기회를<br/> 1번 드릴게요!</span></p>
        </div>),
        (<div
            style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            }}
            className="w-[310px] flex flex-col items-center text-center text-white"
        >
            <div className="mb-[10dvh]">
                <img src={chatlist_ex} alt="채팅방 목록 예시" style={{ width: "100%", height: "auto" }} />
            </div>
            <div className="text-[18px]">
                <p className="text-[#FFF09A]">서로 익명 편지를 주고 받았다면,</p>
                <p>
                    2월 14일 당일 대화를 할 수 있는{" "}
                    <span className="text-[#FFF09A] font-bold">익명채팅방</span>을 <br/> 열어드릴게요!
                </p>
                <br/>
                <p>
                    서로 모르는 상태에서 <br/>
                    누가 나한테 편지를 보낸건지 <br/>
                    대화를 통해 재밌게 맞춰보세요.
                </p>
            </div>
        </div>),

       //공유모달 
        (<div
            style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            }}
            className="w-[310px] flex flex-col items-center text-center text-white"
        >
            <div className="text-[18px]">
                <p>
                    내{" "}
                    <span className="text-[#FFF09A]">초콜릿 보관함 링크를 공유해서</span>
                </p>
                <p>친구들에게 편지를 받아보세요!</p>
                <br/>
                <p>
                    "링크 복사, QR 코드, 카카오톡 전송"으로 <br/>
                    편하게 링크를 공유해보세요.
                </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
                <div className="mt-[30px] w-[272px] h-[135px]">
                    <img src={sharemodal_ex} alt="공유모달 예시" />
                </div>
                <div>
                    <FiArrowUpCircle size={40} />
                </div>
                <div>
                    <img src={share_button} alt="" />
                </div>
            </div>
        </div>),

        //시작하기
        (<div
            style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            }}
            className="w-[310px] flex flex-col items-center text-center text-white"
        >
            <div className="text-[18px]">
                <p>
                    지금 선물 상자를 클릭해서  <br/>
                    받은 편지를 열어보고 <br />
                    보낸 친구를 유추해보세요!
                </p>
            </div>
            {/* <div className="mt-[30px] mt-6 flex flex-col items-center px-4">
                <div className="flex flex-col w-[255px] pl-8 flex items-center justify-center heartbeat" >
                    <img
                            src={click_text}
                            alt="click_text"
                            style={{ width: "35%" }}
                        />
                    <img
                        src={giftbox_before_12}
                        alt={`giftbox_before_12`}
                        className="p-2 max-h-60"
                    />
                </div>
            </div> */}
        </div>)
    ]

    return createPortal(
        <div
        className="absolute inset-0 z-50 flex justify-center w-full"
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
            clipPath: `path('${page in [1, 5] ? "" : makeHighlightPath(x, y, radius + 4, page)}')`,
            clipRule: "evenodd",
            boxShadow: "0 0 10px 5px rgba(255,255,255,0.8)",
            pointerEvents: "none", // 장식용
            }}
        />

        {contents[page]}

        {/*
            (3) 안내 문구 & 닫기 버튼 (화면 중앙)
            pointerEvents: auto -> 버튼만 클릭 수용
        */}
        <div
            style={{
            position: "fixed",
            bottom: "5%",
            left: "85%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            }}
            className="flex flex-col items-center text-center text-white"
        >
            {page < 4 ?
                <ImageButton
                    onClick={nextPage}
                    src={ok_button}
                    className="w-[88px] h-[54px]"
                /> :
                <ImageButton
                    onClick={onClose}
                    src={start_button}
                    className="w-[88px] h-[54px]"
                /> 
            }
            
        </div>
        <div className="absolute bottom-4">
            <p className="text-white">{page + 1} / 5</p>
        </div>
        </div>,
        document.body
    );
};

/** 반짝이용 경로를 만드는 헬퍼 함수 (구멍보다 살짝 큰 원) */
function makeHighlightPath(x: number, y: number, radius: number, page: number,) {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rectWidth = radius * 2;
    const rectHeight = radius * 0.8;
    let circle: string | null = null;
    // 화면 전체 사각형
    const rect = `M 0,0 H ${screenW} V ${screenH} H 0 Z`;
    // 원
    if (page !== 8) {
        circle = [
            `M ${x - radius},${y}`,
            `a ${radius},${radius} 0 1,0 ${radius * 2},0`,
            `a ${radius},${radius} 0 1,0 -${radius * 2},0 Z`,
        ].join(" ");
    } else {
        const startX = x - rectWidth / 2;
        const startY = y - rectHeight / 2;

        // 수평 길이와 수직 길이
        const horizontalLength = rectWidth;
        const verticalLength = rectHeight;

        circle = [
        `M ${startX},${startY}`,               // 시작점: 좌측 상단 (borderRadius offset 적용)
        `h ${horizontalLength}`,              // 상단 가로선
        // `q ${borderRadius},0 ${borderRadius},${borderRadius}`,  // 우측 상단 곡선
        `v ${verticalLength}`,                // 우측 세로선
        // `q 0,${borderRadius} -${borderRadius},${borderRadius}`, // 우측 하단 곡선
        `h -${horizontalLength}`,             // 하단 가로선
        // `q -${borderRadius},0 -${borderRadius},-${borderRadius}`,// 좌측 하단 곡선
        `v -${verticalLength}`,               // 좌측 세로선
        // `q 0,-${borderRadius} ${borderRadius},-${borderRadius}`, // 좌측 상단 곡선
        'Z'
        ].join(" ");
    }
    return [rect, circle].join(" ");
}
