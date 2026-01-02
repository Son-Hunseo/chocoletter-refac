import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface useMainNavigateProps {
    targetPerson: "my" | "your";
    timeNow: "before" | "event" | "after";
}

export const useGoMainNavigate = (props: useMainNavigateProps) => {
    const navigate = useNavigate();

    return useCallback(() => {
        const { targetPerson, timeNow } = props;
        navigate(`/main/${targetPerson}/${timeNow}`);
    }, [props, navigate]);
}