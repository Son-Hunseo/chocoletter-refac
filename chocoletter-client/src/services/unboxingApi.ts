import api from "./api";

// 언박싱 전체 일정 조회(giftBoxId의 언박싱 전체 스케줄)
export async function getUnboxingSchedule(giftBoxId: string) {
  try {
    const res = await api.get(`/api/v1/gift-box/${giftBoxId}/unboxing/schedule`);
    return res.data;
  } catch (err) {
    console.error("getUnboxingSchedule API 호출 중 에러 발생:", err);
    return null;
  }
}

// const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2IiwiaWF0IjoxNzM4MjMwMjY2LCJleHAiOjE3Mzg4MzUwNjZ9.BCOFNjcRsaIBTDr_4ksQ1UHu2kprGvgTb-SNZ7Hjjd4'
// const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOCIsImlhdCI6MTczODI3OTk3MSwiZXhwIjoxNzM4ODg0NzcxfQ.i7E3fDn9tkwcJBQQCIy0y8Ev6dyfCICx79QBxJol4I0'
// export async function getUnboxingSchedule(giftBoxId: number) {
//   try {
//     const res = await api.get(`/api/v1/gift-box/${giftBoxId}/unboxing/schedule`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             }
//         })
//     return res.data;
//   } catch (err) {
//     console.error("getUnboxingSchedule API 호출 중 에러 발생:", err);
//     return null;
//   }
// }

// 언박싱 초대 시간 조회(giftId의 언박싱 시간)
export async function getNotFixedUnboxingTime(giftId: number) {
  try {
    const res = await api.get(`/api/v1/gift/${giftId}/unboxing/invitation`);
    return res.data;
  } catch (err) {
    console.error("getNotFixedUnboxingTime API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 일정 수락
export async function patchUnboxingAccept(giftId: string) {
  try {
    const res = await api.patch(`/api/v1/gift/${giftId}/unboxing/invitation/accept`);
    return res.data;
  } catch (err) {
    console.error("patchUnboxingAccept API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 일정 거절
export async function patchUnboxingReject(giftId: string) {
  try {
    const res = await api.patch(`/api/v1/gift/${giftId}/unboxing/invitation/reject`);
    return res.data;
  } catch (err) {
    console.error("patchUnboxingReject API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 일정 요청
export async function sendUnboxingTime(giftId: number, unBoxingTime: string) {
  try {
    const res = await api.post(`/api/v1/gift/${giftId}/unboxing/invitation`,
    {
      unBoxingTime: unBoxingTime, // 요청 바디
    },
  );
    return res.data;
  } catch (err) {
    console.error("sendUnboxingTime API 호출 중 에러 발생:", err);
    return null;
  }
}

// export async function sendUnboxingTime(giftId: number, unBoxingTime: string) {
//   try {
//     const res = await api.post(`/api/v1/gift/${giftId}/unboxing/invitation`,
//     {
//       unBoxingTime: unBoxingTime, // 요청 바디
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // 인증 토큰 헤더
//       },
//     }
//   );
//     return res.data;
//   } catch (err) {
//     console.error("sendUnboxingTime API 호출 중 에러 발생:", err);
//     return null;
//   }
// }

// 내 언박싱 일정 조회
export async function fetchMyUnboxingSchedule() {
  try {
    // url: /api/v1/gift-box/unboxing/schedule
    const res = await api.get(`/api/v1/gift-box/unboxing/schedule`);
    console.log("내 언박싱 일정 조회 성공 : ", res.data)
    return res.data;
  } catch (err) {
    console.error("fetchMyUnboxingSchedule API 호출 중 에러 발생:", err);
    throw err;
  }
}