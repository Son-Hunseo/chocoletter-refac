import api from "./api";

// 채팅방 리스트 가져오기
export async function getChatRooms() {
  try {
    const res = await api.get(`/api/v1/chat-room/all`);
    const data = res.data;
    return data;
  } catch (err) {
    console.error("getChatRooms API 호출 중 에러 발생:", err);
    throw err;
  }
}
// export async function getChatRooms() {
//   try {
//     const res = await api.get(`/api/v1/chat-room/all`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       withCredentials: true,
//     });
//     const data = res.data;
//     return data;
//   } catch (err) {
//     console.error("getChatRooms API 호출 중 에러 발생:", err);
//     throw err;
//   }
// }

// 채팅방 편지 가져오기
export async function getLetterInchat(roomId:string) {
  try {
    const res = await api.get(`/api/v1/chat-room/${roomId}/letter`);
    const data = res.data;
    return data;
  } catch (err) {
    console.error("getLetterInchat API 호출 중 에러 발생:", err);
    throw err;
  }
}
// export async function getLetterInchat(roomId:string) {
//   try {
//     const res = await api.get(`/api/v1/chat-room/${roomId}/letter`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       withCredentials: true,
//     });
//     const data = res.data;
//     return data;
//   } catch (err) {
//     console.error("getLetterInchat API 호출 중 에러 발생:", err);
//     throw err;
//   }
// }