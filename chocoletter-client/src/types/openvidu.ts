import { Publisher, Session, StreamManager, Subscriber } from "openvidu-browser";

export interface User {
  sessionId?: string;
  username?: string;
}

export interface VideoState {
  session?: Session;
  mainStreamManager?: StreamManager;
  publisher?: Publisher;
  subscribers: Subscriber[];
}