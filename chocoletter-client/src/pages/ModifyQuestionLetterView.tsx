import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import { SingleLetterLimitModal } from "../components/common/SingleLetterLimitModal";
import QuestionLetterForm from "../components/write-letter/QuestionLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { questionLetterState } from "../atoms/letter/letterAtoms" ;
import { ImageButton } from "../components/common/ImageButton";
import modify_button from "../assets/images/button/modify_button.svg";
import { updateLetter } from "../services/giftEncryptedApi";

// 편지지 선택 뷰 이후, 랜덤 질문 형식 편지지 작성 화면
const ModifyQuestionLetterView = () => {
    const [letter, setLetter] = useRecoilState(questionLetterState);
    const [searchParams] = useSearchParams();
    const giftId = searchParams.get("giftId");
    const { giftBoxId } = useParams();
    const navigate = useNavigate();

    const resetLetterState = () => {
        setLetter({
            nickname: "",
            question: "",
            answer: "",
            answerLength: 0,
        });
    };
    const handleGoBack = () => {
        resetLetterState(); // 상태 초기화
    };

    const handleModify = async () => {
            try {
                await updateLetter(
                    giftId as string,
                    letter.nickname,
                    letter.question,
                    letter.answer,
                    null);
            } catch (error: any) {
                console.error("updateLetter failed:", error);
            }
    
            navigate("/sent-gift"); // 전송 완료 화면으로 이동 
        }


    return (
        <div className="relative flex flex-col items-center h-screen bg-letter-blue-background">
            <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" onClick={handleGoBack} />

            <div className="absolute mt-[41px] m-4">
                {/* 로고 이미지  */}
                <div className="flex flex-col items-center mb-[30px]">
                    <img src={login_view_service_title} alt="login_view_service_title" className="" />
                </div>

                <div>
                    {/* QuestionLetterForm */}
                    <QuestionLetterForm />

                    {/* 편지 수정 완료 버튼 */}
                    <div className="relatvie text-center">
                        <ImageButton
                            onClick={handleModify}
                            src={modify_button}
                            className="absolute right-0 gap-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyQuestionLetterView;
