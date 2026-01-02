package chocoletter.chat.api.chat.domain;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@NoArgsConstructor
public class ChatMessage {
    @Id
    private String id;
    private String roomId;
    private String senderId;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;
    private Boolean isRead;

    @Builder
    public ChatMessage(String roomId, String senderId, String senderName, String content, Boolean isRead) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.isRead = isRead;
    }
}
