import React from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { freeLetterState } from "../../atoms/letter/letterAtoms" ;

const GeneralLetterForm: React.FC = () => {
    const [letter, setLetter] = useRecoilState(freeLetterState);

    const nicknameToastId = "nickname-warning";
    const contentToastId = "content-warning";

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 15) {
            if (!toast.isActive(nicknameToastId)) {
                toast.error("닉네임은 15글자 이하로 설정해주세요!", {
                    toastId: nicknameToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            setLetter((prev) => ({ ...prev, nickname: value.substring(0,15) }));
            } else {
            setLetter((prev) => ({ ...prev, nickname: value }));
            }
        };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 150) {
        if (!toast.isActive(contentToastId)) {
            toast.error("150글자 이하로 작성해주세요!", {
            toastId: contentToastId,
            position: "top-center",
            autoClose: 2000,
            });
        }
        setLetter((prev) => ({
            ...prev,
            content: value.substring(0, 150),
            contentLength: 150,
        }));
        } else {
        setLetter((prev) => ({
            ...prev,
            content: value,
            contentLength: value.length,
        }));
        }
    };

  return (
    <div className="w-full flex flex-col justify-center items-center mb-[20px] ">
      {/* 닉네임 */}
      <div className="relative flex flex-row justify-center items-center mb-[16px] gap-[11px]">
        <p className="text-[18px]"><strong>FROM.</strong></p>
        <input
          type="text"
          value={letter.nickname}
          className="flex w-[270px] p-2 items-center gap-2 rounded-[15px] border border-black bg-white flex-1 text-center font-sans text-[18px] leading-[22px] tracking-[-0.408px] outline-none focus:ring-0"
          onChange={handleNicknameChange}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "익명 닉네임을 설정해주세요.")}
          placeholder="익명 닉네임을 설정해주세요."
        />
      </div>
      {/* 답변 */}
      <div className="relative">
        <textarea
          value={letter.content}
          className="flex w-[330px] min-h-[250px] p-[10px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-solid border-black bg-white flex-1 text-[#151517] text-center font-sans text-[18px] leading-[27px] tracking-[-0.408px] outline-none focus:ring-0"
          onChange={handleContentChange}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "메세지를 작성해보세요.(최소 10자)")}
          placeholder="메세지를 작성해보세요.(최소 10자)"
        />
        <span className="absolute right-[20px] bottom-[10px] text-gray-400">
          {letter.contentLength}/150
        </span>
      </div>
    </div>
  );
};

export default GeneralLetterForm;
