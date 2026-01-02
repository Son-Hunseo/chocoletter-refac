import { useNavigate } from "react-router-dom";

const GoToMainMyEventButton = () => {
    const navigate = useNavigate();
    const giftBoxId = localStorage.getItem("giftBoxId");

    const goBackMainMyEvent = () => {
        if (giftBoxId) {
            navigate(`/main/${giftBoxId}`);
        } else {
            navigate("/");
        }
    }

    return (
        <div>
            <button onClick={goBackMainMyEvent} className="text-center text-white text-lg font-normal font-sans leading-snug">내 선물상자로 바로 이동</button>
        </div>
    )
}

export default GoToMainMyEventButton;