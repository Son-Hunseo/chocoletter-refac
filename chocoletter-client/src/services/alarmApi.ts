import api from "./api";

export interface Alarm {
  alarmId: number;
  alarmType: "ACCEPT_SPECIAL" | "REJECT_SPECIAL" | "RECEIVE_SPECIAL" | "UNBOXING_NOTICE";
  partnerName: string;
  unBoxingTime?: string; // API 응답과 동일하게 수정
  giftId: string | null;
  read: boolean;
}

/**
 * 모든 알림 데이터를 GET 요청으로 받아옵니다.
 * @returns {Promise<Alarm[]>} 알림 데이터 배열
 */
export async function getAllAlarms(): Promise<Alarm[]> {
  try {
    const res = await api.get("/api/v1/alarm/all");
    // 응답 데이터가 { alarms: Alarm[] } 형태라고 가정합니다.
    return res.data.alarms;
  } catch (err) {
    console.error("알림 API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 새로운 알림 개수를 GET 요청으로 받아옵니다.
 * @returns {Promise<number>} 새로운 알림 개수
 */
export async function getAlarmCount(): Promise<number> {
  try {
    const res = await api.get("/api/v1/alarm/count");
    return res.data.count;
  } catch (err) {
    console.error("알람 개수 API 호출 중 에러 발생:", err);
    throw err;
  }
}
