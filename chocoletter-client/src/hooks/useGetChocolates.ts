import { useState, useEffect } from "react";
import { getGiftList } from "../services/giftApi";

export const useFetchChocolates = (filter: string, refresh: boolean) => {
    const [cachedData, setCachedData] = useState<{ [key: string]: any[] }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // API 호출로 데이터 가져오기
                const chocolates = await getGiftList(filter);
                console.log("is in" ,chocolates)
                setCachedData((prev) => ({
                    ...prev,
                    [filter]: chocolates.gifts, // filter별 데이터 저장
                }));
            } catch (error) {
                console.error("Error fetching chocolates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData(); // 초기 데이터 로드

        // 5분마다 데이터 갱신
        const interval = setInterval(fetchData, 300000); 
        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, [filter, refresh]);

    return { data: cachedData[filter] || [], isLoading };
};
