import React, { useState, useEffect  } from "react";
import { useRecoilState } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShuffleButton } from "./ShuffleButton";
import { getQuestion } from "../../services/questionApi";
import question_icon from "../../assets/images/letter/question_icon.svg";
import { questionLetterState } from "../../atoms/letter/letterAtoms";


const QuestionLetterForm: React.FC = () => {
    const [letter, setLetter] = useRecoilState(questionLetterState);
    // const [randomQuestion, setRandomQuestion] = useState("랜덤질문이 들어갈 자리입니다.")

    const nicknameToastId = "nickname-warning";
    const answerToastId = "answer-warning";

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


    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 150) {
            if (!toast.isActive(answerToastId)) {
                    toast.error("150글자 이하로 작성해주세요!", {
                    toastId: answerToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            setLetter((prev) => ({
                ...prev,
                answer: value.substring(0, 150),
                answerLength: 150,
            }));
        } else {
            setLetter((prev) => ({
                ...prev,
                answer: value,
                answerLength: value.length,
            }));
        }
    };

    // 질문 섞기 핸들러
    const onShuffleQuestion = async () => {
        const questionData = await getQuestion(); 
        if (questionData) {
            setLetter((prev) => ({ ...prev, question: questionData }));
        } else {
            toast.error("질문을 가져오는 데 실패했습니다.");
        }
    };

    // 페이지가 로딩될 때 한 번 실행
    useEffect(() => {
        onShuffleQuestion();
    }, []); // 빈 배열을 넣어 최초 렌더링 시 실행


    return (
        <div className="flex flex-col justify-center items-center mb-[20px] gap-[20px]">
            {/* 닉네임 */}
            <div className="relative flex flex-raw justify-center items-center gap-[11px]">
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
            {/* 질문 */}
            <div className="flex flex-raw justify-center items-center gap-[5px]">
                <div className="flex w-[260px] h-[70px] p-[10px] items-center gap-[10px] rounded-[15px] border border-black bg-white">
                    <img src={question_icon} alt="login_view_service_title" className="" />
                    <h1 className={`flex-1 text-center font-sans leading-[22px] tracking-[-0.408px] break-keep ${
                        letter.question.length > 50 ? "text-[14px]" : "text-[18px]"
                    }`} >                        
                        {letter.question ? letter.question : "질문을 불러오는 중입니다..."}
                    </h1>
                </div>
                <div className="relative z-50">
                    <ShuffleButton
                        altText="질문 섞기 버튼"
                        onShuffleClick={onShuffleQuestion}
                        className="border border-black h-[70px] rounded-[8px]"
                     />
                </div>
            </div>
            {/* 답변 */}
            <div className="relative">
                <textarea
                    value={letter.answer}
                    className="flex w-[330px] min-h-[250px] p-[10px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-solid border-black bg-white flex-1 text-[#151517] text-center font-sans text-[18px] leading-[27px] tracking-[-0.408px] outline-none focus:ring-0"
                    onChange={handleAnswerChange}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "메세지를 작성해보세요.(최소 10자)")}
                    placeholder="메세지를 작성해보세요.(최소 10자)"
                />
                <span className="absolute right-[10px] bottom-[10px] text-gray-400">{letter.answerLength}/150</span>
            </div>
        </div>       
    );
}

export default QuestionLetterForm;