import { GoToMainMyBeforeButton } from "../components/rejected/button/GoToMainMyBeforeButton";
import classes from "../styles/outGiftBoxChoco.module.css";

const RejectedView = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-y-16 h-full">
            <div className={classes.chocoes}>
                <img src="#" alt="#" />
            </div>
            <p>
                약속 시간이 정해지지 않아<br/>더이상 시간 재설정은 어려워졌어요😢<br/>
                하지만 걱정마세요!!<br/>일반 초코릿으로 당신의 따뜻한 마음을 전해드렸어요~!❤️
            </p>
            <GoToMainMyBeforeButton />
        </div>
    )
}

export default RejectedView