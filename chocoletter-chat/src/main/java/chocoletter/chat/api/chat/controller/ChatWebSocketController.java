package chocoletter.chat.api.chat.controller;

import chocoletter.chat.api.chat.dto.request.ChatMessageRequestDto;
import chocoletter.chat.api.chat.service.ChatMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatMessageProducer chatMessageProducer;

    @MessageMapping("/send")
    public void sendMessage(ChatMessageRequestDto chatMessageRequestDto) {
        chatMessageProducer.sendMessage(chatMessageRequestDto.getRoomId(), chatMessageRequestDto);
    }
}
