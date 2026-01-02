import { OpenVidu } from 'openvidu-browser';
import { User, VideoState } from "../types/openvidu";
import { getUserInfo } from '../services/userInfo';

import axios from 'axios';
import React from 'react';

const APPLICATION_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
const OPENVIDU_URL = import.meta.env.VITE_OPENVIDU_SERVER_URL
const OPENVIDU_SECRET_BASE = import.meta.env.VITE_OPENVIDU_SECRET_BASE

const userInfo = getUserInfo();

export const joinSession = async (
	user: User,
	setSessionId: React.Dispatch<React.SetStateAction<string | undefined>>,
	setVideo: React.Dispatch<React.SetStateAction<VideoState>>,
	setIsTerminate: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	if (!user.sessionId) return;

	// Openvidu 객체 생성
	const OV = new OpenVidu();

	// 세션 생성
	const session = OV.initSession();

	// stream 생성
	session.on("streamCreated", (event) => {
		try {
			const subscriber = session.subscribe(event.stream, undefined)
			setVideo((prevVideo) => ({
				...prevVideo,
				subscribers: [...prevVideo.subscribers, subscriber],
			}));
		} catch (err) {
			console.log("stream 생성 중 오류 발생! : ", err);
		}
	});

	session.on("streamDestroyed", (event) => {
		setVideo((prevVideo) => {
			const StreamManager = event.stream.streamManager;
			return {
				...prevVideo,
				subscribers: prevVideo.subscribers.filter(
					(sub) => sub !== StreamManager
				)
			}
		})
	});

	session.on("connectionDestroyed", (event) => {
		console.log("회의 종료", event.type)
		setIsTerminate(true)
	})

	// On every asynchronous exception...
	session.on('exception', (exception) => {
		console.warn(exception);
	});

	// publish 연결
	getToken(user.sessionId).then((token) => {
		console.log('token : ', token)
		session
			.connect(token, { clientData: user.username })
			.then(async () => {
				const publisher = await OV.initPublisherAsync(undefined, {
					audioSource: undefined, // 기본 마이크
					videoSource: undefined, // 기본 카메라
					publishAudio: true, // 오디오 송출 여부
					publishVideo: true, // 비디오 송출 여부
					resolution: '640x480', // 해상도
					frameRate: 30, // 프레임 레이트
					mirror: true, // 거울모드
				});

				session.publish(publisher);

				// Set the main video in the page to display our webcam and store our Publisher
				setVideo((prev) => ({
					...prev,
					session: session,
					mainStreamManager: publisher,
					publisher: publisher,
				}));
			})
			.catch((error) => {
				console.log('토큰 연결 오류:', error.code, error.message);
			});
	});
}

export const leaveSession = async (
	manageVideo: VideoState,
	setVideo: React.Dispatch<React.SetStateAction<VideoState>>,
	setIsTerminate: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	if (manageVideo.session) {
		try {
			if (manageVideo.publisher) {
				manageVideo.publisher.stream.getMediaStream().getTracks().forEach(track => {
					track.stop();
					track.enabled = false;
				});
				manageVideo.publisher.stream.disposeWebRtcPeer();
				manageVideo.publisher.stream.disposeMediaStream();
				manageVideo.publisher = undefined;
			}
			manageVideo.subscribers.forEach(subscriber => {
				subscriber.stream.getMediaStream().getTracks().forEach(track => {
					track.stop()
					track.enabled = false;
				});
			});
			
			manageVideo.session.disconnect();
			deleteSession(manageVideo.session.sessionId);
		} catch (err) {
			console.log("연결 해제 오류 : ", err)
		} finally {
			setVideo((prevVideo) => ({
				...prevVideo,
				session: undefined,
				mainStreamManager: undefined,
				publisher: undefined,
				subscribers: [],
			}));
			setIsTerminate(true);
		}
	}
}

// 세션ID와 토큰 생성
const getToken = async (roomId: string) => {
	const sessionId = await createSession(roomId);
	return await createToken(sessionId);
};

const createSession = async (roomId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + '/api/v1/openvidu/sessions', { customSessionId: roomId }, {
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${userInfo?.accessToken}`
		},
		withCredentials: true,
	});
	return response.data; // The sessionId
};

const createToken = async (sessionId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + '/api/v1/openvidu/sessions/' + sessionId + '/connections', {}, {
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${userInfo?.accessToken}`
		},
		withCredentials: true,
	});
	return response.data; // The token
};

const deleteSession = async (sessionId: string) => {
	if (sessionId === undefined) return;

	await axios.delete(`${OPENVIDU_URL}openvidu/api/sessions/${sessionId}/`, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${OPENVIDU_SECRET_BASE}`,
		},
		withCredentials: true,
	})
}
