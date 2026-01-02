import { Button } from "../../common/Button";
import { useGoMainNavigate } from "../../../hooks/useMainNavigate";

export const GoToMainMyBeforeButton = () => {
    const goMainNavigate = useGoMainNavigate({"targetPerson": "my", "timeNow": "before"})
    return (
        <div className="flex flex-col gap-y-5 w-full px-5">
            <Button onClick={goMainNavigate} className="py-5 bg-white">
                내 초콜릿 상자로 이동하기
            </Button>
        </div>
    )
}