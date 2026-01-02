import React, { useState } from "react";

type AmPmDialProps = {
  onAmPmChange: (amPm: string) => void;
};

const AmPmDial: React.FC<AmPmDialProps> = ({ onAmPmChange }) => {
  const [amPm, setAmPm] = useState("오전");

  // 오전/오후 배열
  const amPmOptions = ["오전", "오후"];

  // 스크롤 변경 처리
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const index = Math.round(e.currentTarget.scrollTop / 55);
    const newAmPm = amPmOptions[index % 2];
    setAmPm(newAmPm);
    onAmPmChange(newAmPm); // 부모 컴포넌트에 새로운 값 전달
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="h-[250px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {/* 위쪽 빈 공간 */}
        <div className="h-[85px]"></div>

        {/* 오전/오후 옵션 */}
        {amPmOptions.map((option, index) => (
          <div
            key={index}
            className={`w-[74px] whitespace-nowrap flex items-center justify-center snap-center mb-[18px] ${
              amPm === option
                ? "text-black text-bold text-[28px] h-[80px] px-[15px] py-[20px]" // 선택된 항목
                : "text-[#595B66] text-[24px]" // 선택되지 않은 항목
            }`}
          >
            {option}
          </div>
        ))}

        {/* 아래쪽 빈 공간 */}
        <div className="h-[85px]"></div>
      </div>
    </div>
  );
};

export default AmPmDial;
