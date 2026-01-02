import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Button } from "../components/common/Button";
import classes from "../styles/outGiftBoxChoco.module.css";
import choco_with_wing from "../assets/images/chocolate/choco_with_wing.png";
import { useGoMainNavigate } from "../hooks/useMainNavigate";
import ChangeGeneralGiftModal from "../components/reset-time/modal/ChangeGeneralGiftModal";

const ResetTimeView = () => {
    const navigate = useNavigate();
    const [isChange, setIsChange] = useState(false);
    const goToMainMyBefore = useGoMainNavigate({ targetPerson: "my", timeNow: "before"});

    // 추후 사용자 로그인 판정 추가
    // 비로그인 => 로그인 페이지로

    // 시간 설정 페이지로 이동동
    const goToSetTimeHandler = () => {
        navigate('/main/my/before')
        // 추후 setTimeView로 연결 변경
        // 시간 정보, 기존 초콜릿 정보를 여기서 넘겨줘야 하는가에 따라 달라짐
        // 거절 횟수도 갱신 필요. api/v1/gift/{giftId}/unboxing/invitation/reject
    }

    // 일반 초콜릿으로 바꿀래요! 모달 띄우고, 일반 초콜릿로 변경
    const changeGeneralGiftHandler = () => {
        setIsChange(true);
        // 일반 초콜릿으로 변환 api/v1/gift/{giftId}/type
    }

    // 내 초콜릿 상자로 돌아갑니다.


    return (
        <>
            <ChangeGeneralGiftModal
                isOpen={isChange}
                onClose={goToMainMyBefore}
            />
            <div className="flex flex-col justify-center items-center gap-y-16">
                <div className={classes.chocoes}>
                    <img src={choco_with_wing} alt="wing-choco" />
                </div>
                <div className="flex flex-col gap-y-5 w-full px-5">
                    <Button onClick={goToSetTimeHandler} className="py-5 bg-white">
                        다른 시간으로 <br /> 약속을 잡을래요!
                    </Button>
                    <Button onClick={changeGeneralGiftHandler} className="py-5 bg-white">
                        일반 초콜릿으로 <br /> 바꿀래요!
                    </Button>
                </div>
            </div>
        </>
    )
};

export default ResetTimeView;