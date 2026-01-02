import { useEffect, useState, createContext, useContext } from "react";
// import { io } from "socket.io-client";

// 서버 URL
const SOCKET_URL = "http://localhost:9092";
// const socketInstance = io(SOCKET_URL);

// 상태를 관리할 Context 생성
interface SocketContextType {
	userList: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

// WebSocketIO 컴포넌트
export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// const [socket, setSocket] = useState<Socket | null>(null);
	const [userList, setUserList] = useState<string[]>([]); // 접속한 사용자 목록

	// useEffect(() => {
	// 	// 웹소켓 연결

	// 	socketInstance.on("connect", () => {
	// 		console.log("Connected to Socket.IO server");
	// 	});

	// 	// 서버에서 'userList' 이벤트 수신
	// 	socketInstance.on("userList", (userList: string[]) => {
	// 		console.log("in_use", userList);
	// 		setUserList(userList); // 사용자 목록 업데이트
	// 	});

	// 	socketInstance.on("disconnect", () => {
	// 		console.log("Socket.IO 클라이언트 연결 종료");
	// 	});

	// 	return () => {
	// 		socketInstance.off("userList");
	// 	};
	// }, []);

	return (
		<SocketContext.Provider value={{ userList }}>
			{children}
		</SocketContext.Provider>
	);
};

// SocketContext 사용 hook
export const useSocket = () => {
	return useContext(SocketContext);
};
