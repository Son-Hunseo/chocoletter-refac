package chocoletter.chat.api.chat.controller;

import chocoletter.chat.api.chat.dto.request.ChatMessageRequestDto;
import chocoletter.chat.api.chat.service.ChatMessageProducer;
import chocoletter.chat.common.exception.ErrorMessage;
import chocoletter.chat.common.exception.InternalServerException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatMessageProducer chatMessageProducer;

    @MessageMapping("/send")
    public void sendMessage(ChatMessageRequestDto chatMessageRequestDto) {
        // Kafka로 메시지 전송
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String message = objectMapper.writeValueAsString(chatMessageRequestDto);
            chatMessageProducer.sendMessage(chatMessageRequestDto.getRoomId(), message); // Kafka topic으로 전송
        } catch (JsonProcessingException e) {
            throw new InternalServerException(ErrorMessage.ERR_SERIALIZE_MESSAGE);
        }
    }
}
