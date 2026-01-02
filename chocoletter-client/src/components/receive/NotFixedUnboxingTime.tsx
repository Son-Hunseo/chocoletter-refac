import { useEffect, useState } from 'react';
import { getNotFixedUnboxingTime } from "../../services/unboxingApi";

// 상대가 나에게 요청한 webRTC 초콜릿 개봉 시간 가져오기 - 초대장에서 가져오기
interface NotFixedUnboxingTimeProps {
    giftId: number;
    onTimeFetched: (time: string | null, error: boolean) => void;
  }

const NotFixedUnboxingTime: React.FC<NotFixedUnboxingTimeProps> = ({
    giftId,
    onTimeFetched,
}) => {
    useEffect(() => {
        const fetchUnboxingTime = async () => {
            try {
                const data = await getNotFixedUnboxingTime(giftId);
                if (data && data.unboxingTime) {
                    onTimeFetched(data.unboxingTime, false); // time 전달
                } else {
                    onTimeFetched(null, true); // 에러 전달
                }
            } catch (err) {
                console.error("Error fetching unboxing time:", err);
                onTimeFetched(null, true); // 에러 전달
            }
        };
  
        fetchUnboxingTime();
    }, [giftId, onTimeFetched]);
  
    return null; // UI는 렌더링하지 않음
  };
  
  export default NotFixedUnboxingTime;
