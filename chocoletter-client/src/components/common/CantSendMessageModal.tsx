import React from "react";
import { useRecoilValue } from "recoil";
import Modal from "./Modal";
import { PurpleButton } from "./PurpleButton";
import { CheckLetterUseButton } from "../gift-list-before/button/CheckLetterUseButton";
import readLetterIcon from "../../assets/images/unboxing/letter_purple.svg"
import { CiCircleAlert } from "react-icons/ci";
import { BiErrorCircle } from "react-icons/bi";

interface CantSendMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CantSendMessageModal: React.FC<CantSendMessageModalProps> = ({ isOpen, onClose }) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <div className="text-center flex flex-col justify-center items-center gap-4">
                <div className="w-7 h-7">
                    {/* <img src={readLetterIcon} alt="편지 아이콘" className="w-full h-full" /> */}
                    <BiErrorCircle color="#9E4AFF" size={30} />
                </div>
                <div className="px-[15px] py-[5px] bg-[#efe1ff] rounded-[18px] justify-center items-center gap-1 inline-flex">
                    <p>
                        아쉽지만 이미 편지를 보냈어요! <br/>
                        한 번 작성한 편지는 삭제할 수 없으며,<br/>
                        같은 사람에게는 단 한 번만 보낼 수 있답니다. 💌
                    </p>
                </div>
                {/* <div className="w-full flex justify-evenly"> */}
                    {/* <PurpleButton onClick={onClose} className="bg-white text-black border border-black">
                        아낄래요
                    </PurpleButton>
                    <CheckLetterUseButton onClick={onClose} /> */}
                {/* </div> */}
            </div>
        </Modal>
    )
}