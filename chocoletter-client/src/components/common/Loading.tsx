import React from "react";

/**
 * Tailwind CSS를 활용한 깔끔한 로딩 스피너
 * - 가운데에 원형 스피너가 돌면서 텍스트(‘Loading...’)가 표시됩니다.
 */
const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
      {/* 원형 로딩 스피너 */}
      <div className="w-12 h-12 border-4 border-chocoletterPurpleLight border-t-chocoletterPurple rounded-full animate-spin mb-4"></div>
      {/* 로딩 텍스트 */}
      <div className="text-chocoletterPurple font-semibold text-lg">로딩중...</div>
    </div>
  );
};

export default Loading;
