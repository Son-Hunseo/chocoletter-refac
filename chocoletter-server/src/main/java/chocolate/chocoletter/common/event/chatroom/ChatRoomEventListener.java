package chocolate.chocoletter.common.event.chatroom;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatRoomEventListener {
    private final ChatRoomRepository chatRoomRepository;

    @EventListener
    public void handleChatRoomCreateEvent(ChatRoomCreateEvent event) {
        chatRoomRepository.save(ChatRoom.builder()
                .hostId(event.getHostId())
                .guestId(event.getGuestId())
                .hostGiftId(event.getHostGiftId())
                .guestGiftId(event.getGuestGiftId())
                .build());
    }
}
