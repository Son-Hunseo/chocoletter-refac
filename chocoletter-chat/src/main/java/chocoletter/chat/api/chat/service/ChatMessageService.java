package chocoletter.chat.api.chat.service;

import chocoletter.chat.api.chat.domain.ChatMessage;
import chocoletter.chat.api.chat.domain.MessageType;
import chocoletter.chat.api.chat.dto.response.ChatMessageResponseDto;
import chocoletter.chat.api.chat.dto.response.ChatMessagesResponseDto;
import chocoletter.chat.api.chat.dto.response.LastChatMessageResponseDto;
import chocoletter.chat.api.chat.repository.ChatMessageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageProducer chatMessageProducer;

    public void saveChatMessage(ChatMessage chatMessage) {
        chatMessageRepository.save(chatMessage);
    }

    public ChatMessagesResponseDto findChatMessages(String roomId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        List<ChatMessageResponseDto> chatMessages = chatMessageRepository.findChatMessages(roomId, pageable)
                .stream()
                .map(chatMessage -> ChatMessageResponseDto.of(MessageType.CHAT, chatMessage))
                .toList();
        return ChatMessagesResponseDto.of(chatMessages);
    }

    public LastChatMessageResponseDto findLastChatMessage(String roomId, String memberId) {
        return chatMessageRepository.findUnReadCountAndLastMessage(roomId, memberId);
    }

    @Transactional
    public void readAllUnreadMessages(String roomId, String memberId) {
        chatMessageRepository.readAllUnreadMessages(roomId, memberId);
    }

    public void noticeReadStatus(String roomId) {
        ChatMessageResponseDto chatMessageResponseDto = ChatMessageResponseDto.builder()
                .roomId(roomId)
                .messageType(MessageType.READ_STATUS)
                .content("채팅 메세지의 읽음 상태가 변경되었습니다.")
                .build();
        chatMessageProducer.sendMessage(roomId, chatMessageResponseDto);
    }
}
