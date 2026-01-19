import { useState, useEffect } from "react";
import { getGiftList } from "../services/giftApi";

export const useFetchChocolates = (refresh: boolean) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const chocolates = await getGiftList();
                console.log("is in" ,chocolates)
                setData(chocolates?.gifts || []);
            } catch (error) {
                console.error("Error fetching chocolates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // 5분마다 데이터 갱신
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [refresh]);

    return { data, isLoading };
};
