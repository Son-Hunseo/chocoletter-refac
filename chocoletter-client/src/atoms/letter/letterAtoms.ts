import { atom } from "recoil";

// /**
//  * 자유 형식 편지 내용
//  */
// export const freeLetterContentAtom = atom<string>({
//   key: "freeLetterContent",
//   default: "",
// });

// /**
//  * 랜덤 질문 편지 질문 
//  */
// export const questionLetterQuestionAtom = atom<string>({
//   key: "questionLetterQuestion",
//   default: "",
// });

// /**
//  * 랜덤 질문 편지 답변 
//  */
// export const questionLetterAnswerAtom = atom<string>({
//   key: "questionLetterAnswer",
//   default: "",
// });

export const freeLetterState = atom({
  key: "freeLetterState",
  default: {
    nickname: "",
    content: "",
    contentLength: 0,
  },
});

export const questionLetterState = atom({
  key: "questionLetterState",
  default: {
    nickname: "",
    question: "",
    answer: "",
    answerLength: 0,
  },
});