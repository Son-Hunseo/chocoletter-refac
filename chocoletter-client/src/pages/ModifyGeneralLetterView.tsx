import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import { SingleLetterLimitModal } from "../components/common/SingleLetterLimitModal";
import GeneralLetterForm from "../components/write-letter/GeneralLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { freeLetterState } from "../atoms/letter/letterAtoms" ;
import { ImageButton } from "../components/common/ImageButton";
import modify_button from "../assets/images/button/modify_button.svg";
import { updateLetter } from "../services/giftEncryptedApi";

const ModifyGeneralLetterView = () => {
    const [letter, setLetter] = useRecoilState(freeLetterState);
    const [searchParams] = useSearchParams();
    const giftLetterId = searchParams.get("giftLetterId");
    const { giftBoxId } = useParams();
    const navigate = useNavigate();

    const resetLetterState = () => {
        setLetter({
            nickname: "",
            content: "",
            contentLength: 0,
        });
    };
    const handleGoBack = () => {
        resetLetterState(); // 상태 초기화
    };

    const handleModify = async () => {
        try {
            await updateLetter(
                giftLetterId as string,
                letter.nickname,
                null,
                null,
                letter.content);
        } catch (error: any) {
            console.error("updateLetter failed:", error);
        }

        navigate("/sent-gift"); // 전송 완료 화면으로 이동
    }

    return (
        <div className="relative flex flex-col items-center h-screen bg-letter-pink-background">
            <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" onClick={handleGoBack} />

            <div className="absolute mt-[41px] m-4">
                {/* 로고 이미지 */}
                <div className="flex flex-col items-center mb-[30px]">
                <img src={login_view_service_title} alt="login_view_service_title" />
                </div>

                <div>
                    {/* GeneralLetterForm */}
                    <GeneralLetterForm />

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

export default ModifyGeneralLetterView;
