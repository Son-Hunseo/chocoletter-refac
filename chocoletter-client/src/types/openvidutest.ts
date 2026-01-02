import { Publisher, Session, StreamManager, Subscriber } from "openvidu-browser";

export interface User {
    sessionId?: string | null;
    username?: string;
}

export interface VideoState {
    session?: Session;
    mainStreamManager?: StreamManager;
    publisher?: Publisher;
    subscribers?: Subscriber;
}

export interface GiftDetail {
    giftId: string;
    type: "FREE" | "QUESTION";
    nickName: string;
    content: string | null;
    question: string | null;
    answer: string | null;
}