import api from './api';

// 언박싱 룸 권한 체크
export async function checkAuthVideoRoom(roomId: string) {
    try {
        const res = await api.get(`/api/v1/unboxing-room/${roomId}/verify`)
        console.log("권한 체크(200) : ", res.data)
        return res.data;
    } catch (err) {
        console.error("언박싱 거절 종류 : ", err);
        throw err;
    }
}

    // 언박싱 종료 시 권한 정지
export async function terminateVideoRoom(roomId: string) {
    try {
        const res = await api.patch(`/api/v1/unboxing-room/${roomId}/end`);
        console.log("안전하게 화상채팅 종료")
        return res.data;
    } catch (err) {
        console.log("종료 오류 : ", err);
        throw err;
    }
}