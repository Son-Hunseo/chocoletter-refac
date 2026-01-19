import { GoBackMainMyButton } from "../components/gift-list/button/GoBackMainMyButton";
import { GiftList } from "../components/gift-list/GiftList";

const GiftListEventView = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden top-0">
                <div className="w-full md:max-w-sm h-[60px] px-4 pt-[17px] bg-chocoletterPurpleBold flex-col justify-center items-start inline-flex fixed top-0 z-50">
                    <div className="self-stretch justify-between items-center inline-flex">
                        <div className="w-6 h-6 justify-center items-center flex overflow-hidden">
                            <GoBackMainMyButton />
                        </div>
                        <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 초콜릿 박스</div>
                        <div className="w-6 h-6" />
                    </div>
                </div>
                <GiftList />
            </div>
        </div>
    )
}

export default GiftListEventView;
