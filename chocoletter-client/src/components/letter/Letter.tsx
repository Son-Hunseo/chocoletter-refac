import React from "react";
import login_view_service_title from "../../assets/images/logo/login_view_service_title.svg";
import question_icon from "../../assets/images/letter/question_icon.svg";

type GiftProps = {
  nickName: string;
  content: string | null;
  question: string | null;
  answer: string | null;
};

const Gift: React.FC<GiftProps> = ({ nickName, content, question, answer }) => {
  return (
    <div className="flex flex-col justify-center items-center text-center w-[363px]">
      {/* w-224인데 닉네임이 길 경우 아래로 가서 우선 300으로 함 */}
      <div className="mb-[27px] w-[300px]">
        <div className="flex flex-col items-center mb-[21px]">
          <img src={login_view_service_title} alt="login_view_service_title" className="" />
          {/* <h1 className="text-gray-600 font-extrabold">chocoletter</h1> */}
        </div>

        <h1 className="self-stretch font-[Dovemayo_gothic] text-[24px] leading-[32px] tracking-[-0.408px]">
          {nickName} 님이 정성 가득 담아 <br />
          보내주신 초콜렛이에요!🍫
        </h1>
      </div>

      {/* 편지 내용 */}
      <div>
        {content ? (
          <div className="flex w-[361px] min-h-[340px] p-[20px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-dashed border-black bg-white">
            <p className="text-[18px] font-[Dovemayo_gothic] font-normal leading-[27px] tracking-[-0.408px] text-center text-[#151517] break-words overflow-hidden">
              {content}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex w-full p-[10px] items-center gap-[10px] rounded-[15px] border border-black bg-white mb-[20px]">
              <img src={question_icon} alt="login_view_service_title" className="" />
              <p className="font-[Dovemayo_gothic] text-[18px] font-normal leading-[22px] tracking-[-0.408px] break-words">
                {question}
              </p>
            </div>

            <div className="flex w-[361px] min-h-[340px] p-[20px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-dashed border-black bg-white">
              <p className="text-[18px] font-[Dovemayo_gothic] font-normal leading-[27px] tracking-[-0.408px] text-center text-[#151517] break-words overflow-hidden">
                {answer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gift;
