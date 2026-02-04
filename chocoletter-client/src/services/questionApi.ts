import api from "./api";

// 질문 목록 가져오기
let previousQuestionId = 0; // 처음 요청 시 0으로 설정
export async function getQuestion() {
    try {
        const res = await api.get(`/api/v1/giftletter/question`, {
            params: {
                previousQuestionId: previousQuestionId, // 쿼리 파라미터 추가
            },
        });

        // 다음 요청을 위한 ID 업데이트
        if (res.data?.id) {
            previousQuestionId = res.data.id; // 응답에서 받은 `id`로 업데이트
        }
        // console.log('Data : ', res.data)

        return res.data.question;
    } catch (err) {
        console.error("getQuestion API 호출 중 에러 발생:", err);
        throw err;
    }
}
    