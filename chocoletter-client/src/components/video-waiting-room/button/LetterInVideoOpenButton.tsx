import React from "react";
import readLetterIcon from "../../../assets/images/unboxing/read_letter_icon.svg";

interface LetterInVideoOpenButtonProps {
    onPush: () => void;
}

const LetterInVideoOpenButton: React.FC<LetterInVideoOpenButtonProps> = ({ onPush }) => {
  return (
    <div>
      <button onClick={onPush} >
        <img src={readLetterIcon} alt="편지 보기 아이콘" />
      </button>
    </div>
  );
};

export default LetterInVideoOpenButton;