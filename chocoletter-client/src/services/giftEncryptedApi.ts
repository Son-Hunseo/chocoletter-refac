import api from "./api";

/**
 * 일반 자유 선물 보내기 API
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param content - 편지 내용 (평문)
 */
export async function sendGeneralFreeGift(
  giftBoxId: string,
  nickName: string,
  content: string
) {
  try {
    const res = await api.post(`/api/v1/giftletter/free`, {
      nickName,
      content,
    }, {
      params: { giftBoxId }
    });
    return res.data;
  } catch (err) {
    console.error("sendGeneralFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 일반 질문 선물 보내기 API
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param question - 질문 내용
 * @param answer - 편지 답변 내용 (평문)
 */
export async function sendGeneralQuestionGift(
  giftBoxId: string,
  nickName: string,
  question: string,
  answer: string
) {
  try {
    const res = await api.post(`/api/v1/giftletter/question`, {
      nickName,
      question,
      answer,
    }, {
      params: { giftBoxId }
    });
    return res.data;
  } catch (err) {
    console.error("sendGeneralQuestionGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 편지 수정하기 API
 *
 * @param giftLetterId - 선물편지 ID
 * @param nickName - 발신자 닉네임
 * @param question - 질문 내용 (평문, nullable)
 * @param answer - 평문 편지 답변 내용 (nullable)
 * @param content - 평문 편지 내용 (nullable)
 */
export async function updateLetter(
  giftLetterId: string,
  nickName: string,
  question: string | null,
  answer: string | null,
  content: string | null,
) {
  try {
    // question, answer, content가 모두 null이면 예외 처리
    if (!question && !answer && !content) {
      throw new Error("Neither question, answer, nor content provided.");
    }

    const requestBody = {
      nickName,
      question: question ?? null,
      answer: answer ?? null,
      content: content ?? null
    };

    const res = await api.patch(`/api/v1/giftletter/${giftLetterId}`, requestBody);
    return res.data;

  } catch (err) {
    console.error("updateLetter API 호출 중 에러 발생:", err);
    throw err;
  }
}
