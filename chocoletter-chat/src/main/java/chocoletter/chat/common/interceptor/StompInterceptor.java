package chocoletter.chat.common.interceptor;

import chocoletter.chat.api.chat.service.ChatMessageService;
import chocoletter.chat.api.chat.service.ChatRoomService;
import chocoletter.chat.common.exception.BadRequestException;
import chocoletter.chat.common.exception.ErrorMessage;
import chocoletter.chat.common.exception.InternalServerException;
import chocoletter.chat.common.exception.UnAuthorizedException;
import chocoletter.chat.common.util.IdEncryptionUtil;
import chocoletter.chat.common.util.JwtUtil;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final IdEncryptionUtil idEncryptionUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        // DISCONNECT 커맨드일 경우 토큰 검증 skip
        if (accessor.getCommand() == StompCommand.DISCONNECT) {
            return message;
        }
        String memberId;
        try {
            Long beforeId = verifyAccessToken(getAccessToken(accessor));
            memberId = idEncryptionUtil.encrypt(beforeId);
        } catch (Exception e) {
            throw new InternalServerException(ErrorMessage.ERR_ENCRYPT_FAIL);
        }
        log.info("StompAccessor = {}", accessor);
        handleMessage(accessor.getCommand(), accessor, memberId);
        return message;
    }

    private void handleMessage(StompCommand stompCommand, StompHeaderAccessor accessor, String memberId) {
        switch (stompCommand) {
            case CONNECT: // 웹소켓 연결할 때
                break;
            case SUBSCRIBE: // 채널 구독할 때 (우리의 경우 채팅방을 접속할 때)
                connectToChatRoom(accessor, memberId);
                break;
            case SEND: // 메세지 전송할 때
                break;
        }
    }

    private void connectToChatRoom(StompHeaderAccessor accessor, String memberId) {
        String roomId = getChatRoomId(accessor);
        chatRoomService.connectChatRoom(roomId, memberId);
        // 읽지 않은 채팅을 전부 읽음 처리
        chatMessageService.readAllUnreadMessages(roomId, memberId);
        // 현재 채팅방에 접속중인 인원이 있는지 확인
        boolean isAllConnected = chatRoomService.isAllConnected(roomId);

        if (isAllConnected) {
            chatMessageService.noticeReadStatus(roomId);
        }
    }

    private String getChatRoomId(StompHeaderAccessor accessor) {
        String destination = accessor.getDestination();

        Pattern pattern = Pattern.compile("/topic/([^/]+)");
        Matcher matcher = pattern.matcher(destination);

        if (matcher.find()) {
            log.info("Parsing roomId: {}", matcher.group(1));
            return matcher.group(1);
        } else {
            log.error("Invalid destination: {}", destination);
            throw new BadRequestException(ErrorMessage.ERR_INVALID_SUBSCRIBE_DESTINATION);
        }
    }


    private String getAccessToken(StompHeaderAccessor accessor) {
        String header = accessor.getFirstNativeHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new BadRequestException(ErrorMessage.ERR_EMPTY_TOKEN);
        } else {
            return header.split(" ")[1];
        }
    }

    private Long verifyAccessToken(String accessToken) {
        if (!jwtUtil.validateToken(accessToken)) {
            throw new UnAuthorizedException(ErrorMessage.ERR_ACCESS_TOKEN_EXPIRED);
        }
        return jwtUtil.getIdFromToken(accessToken);
    }

}
