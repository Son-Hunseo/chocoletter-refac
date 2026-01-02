import { useRecoilValue } from "recoil";
import { selectedGiftTypeAtom } from "../atoms/gift/giftAtoms";
import { FilterButton } from "../components/gift-list-event/button/FilterButton";
import { GoBackMainMyButton } from "../components/gift-list/button/GoBackMainMyButton";
import { GiftList } from "../components/gift-list/GiftList";

const GiftListEventView = () => {
    const filterType = useRecoilValue(selectedGiftTypeAtom)

    return (
        <div>
            <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden top-0">
                <div className="w-full md:max-w-sm h-[90px] px-4 pt-[17px] bg-chocoletterPurpleBold flex-col justify-between items-start gap-[6px] inline-flex fixed top-0 z-50">
                    <div className="self-stretch justify-between items-center inline-flex">
                        <div className="w-6 h-6 justify-center items-center flex overflow-hidden">
                            <GoBackMainMyButton />
                        </div>
                        <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 초콜릿 박스</div>
                        <div className="w-6 h-6" />
                    </div>
                    <div className="justify-start items-center gap-1 inline-flex">
                        <FilterButton />
                    </div>
                </div>
                <GiftList filter={filterType} />
            </div>
        </div>
    )
}

export default GiftListEventView;