package chocolate.chocoletter.api.chatroom.service;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.dto.response.ChatLetterResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final GiftRepository giftRepository;
    private final LetterService letterService;
    private final IdEncryptionUtil idEncryptionUtil;

    public void saveChatRoom(Long hostId, Long guestId, Long hostGiftId, Long guestGiftId) {
        chatRoomRepository.save(ChatRoom.builder()
                .hostId(hostId)
                .guestId(guestId)
                .hostGiftId(hostGiftId)
                .guestGiftId(guestGiftId)
                .build());
    }

    public ChatRoomsResponseDto findMyChatRooms(Long memberId) {
        List<ChatRoomResponseDto> chatRooms = chatRoomRepository.findMyChatRooms(memberId)
                .stream()
                .map(chatRoom -> {
                    Gift guestGift = giftRepository.findGiftByIdOrThrow(chatRoom.getGuestGiftId());
                    Long receiverId = guestGift.getReceiverId();
                    String nickname;
                    if (receiverId.equals(memberId)) {
                        nickname = letterService.findNickNameByGiftId(guestGift.getId());
                    } else {
                        nickname = letterService.findNickNameByGiftId(chatRoom.getHostGiftId());
                    }
                    return ChatRoomResponseDto.of(idEncryptionUtil.encrypt(chatRoom.getId()), nickname);
                })
                .collect(Collectors.toList());
        return ChatRoomsResponseDto.of(chatRooms);
    }


    public ChatLetterResponseDto findReceiveLetter(Long roomId, Long memberId) {
        ChatRoom chatRoom = chatRoomRepository.findChatRoom(roomId);
        Gift hostGift = giftRepository.findGiftByIdOrThrow(chatRoom.getHostGiftId());
        if (hostGift.getReceiverId().equals(memberId)) {
            return ChatLetterResponseDto.of(letterService.findLetter(chatRoom.getHostGiftId()));
        } else {
            return ChatLetterResponseDto.of(letterService.findLetter(chatRoom.getGuestGiftId()));
        }
    }
}
