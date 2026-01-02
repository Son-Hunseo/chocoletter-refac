package chocoletter.chat.api.chat.dto.request;

import chocoletter.chat.api.chat.domain.MessageType;
import lombok.Getter;

@Getter
public class ChatMessageRequestDto {
    private MessageType messageType;
    private String roomId;
    private String senderId;
    private String senderName;
    private String content;
}
