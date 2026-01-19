import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import { SingleLetterLimitModal } from "../components/common/SingleLetterLimitModal";
import { CantSendMessageModal } from "../components/common/CantSendMessageModal";
import GeneralLetterForm from "../components/write-letter/GeneralLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { freeLetterState } from "../atoms/letter/letterAtoms";
import { ImageButton } from "../components/common/ImageButton";
import next_button from "../assets/images/button/next_button.svg";
import { sendGeneralFreeGift } from "../services/giftEncryptedApi";

const WriteGeneralLetterView = () => {
    const [letter, setLetter] = useRecoilState(freeLetterState);
    const { giftBoxId } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alreadySent, setAlreadySent] = useState(false);
    
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

    const handleNextClick  = () => {
        if (letter.nickname.length < 1) {
            if (!toast.isActive("min-nickname-toast")) {
                toast.error("닉네임은 최소 1글자 이상 입력해야 합니다!", {
                    toastId: "min-nickname-toast",
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            return;
        }
        
        if (letter.contentLength < 10) {
            if (!toast.isActive("min-content-toast")) {
                toast.error("메세지는 최소 10글자 이상 작성해야 합니다!", {
                    toastId: "min-content-toast",
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            return;
        }
    
            setIsModalOpen(true);
        };

    const handleSendLetter = async () => {
        setIsModalOpen(false);
        try {
            await sendGeneralFreeGift(giftBoxId as string, letter.nickname, letter.content);
            navigate(`/sent-gift`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "알 수 없는 에러 발생";
            if (errorMessage === "ERR_ALREADY_EXISTS_GIFT" || errorMessage === "알 수 없는 에러 발생") {
                setAlreadySent(true);
            }
        }
    };

    return (
        <div className="relative flex flex-col items-center h-screen bg-letter-pink-background">
            <CantSendMessageModal isOpen={alreadySent} onClose={() => setAlreadySent(false)} />
            <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" onClick={handleGoBack} />

            <div className="absolute mt-[41px] m-4">
                {/* 로고 이미지 */}
                <div className="flex flex-col items-center mb-[30px]">
                <img src={login_view_service_title} alt="login_view_service_title" />
                </div>

                <div>
                    {/* GeneralLetterForm */}
                    <GeneralLetterForm />

                    {/* 편지 작성 완료 버튼 - 모달 열기 */}
                    <div className="relatvie text-center">
                        <ImageButton
                            onClick={handleNextClick}
                            src={next_button}
                            className="absolute right-0 gap-2"
                        />
                        {/* <Button
                            onClick={handleNextClick}
                            className="absolute flex w-[152px] h-[45px] justify-center items-center right-0 gap-2 rounded-[15px] border border-black bg-chocoletterPurpleBold"
                        >
                            <p className="text-white text-center font-sans text-[21px] leading-[22px] tracking-[-0.408px]">
                                다음으로
                            </p>
                        </Button> */}
                    </div>
                </div>
            </div>
            {/* 편지 제한 모달 */}
            <SingleLetterLimitModal
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSend={handleSendLetter} // 보내기 버튼 클릭 시 동작
            />
        </div>
    );
};

export default WriteGeneralLetterView;
