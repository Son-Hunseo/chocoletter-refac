package chocolate.chocoletter.api.chatroom.service;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.dto.response.ChatLetterResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.service.GiftLetterService;
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
    private final GiftLetterService giftLetterService;
    private final IdEncryptionUtil idEncryptionUtil;

    public void saveChatRoom(Long hostId, Long guestId, Long hostGiftLetterId, Long guestGiftLetterId) {
        chatRoomRepository.save(ChatRoom.builder()
                .hostId(hostId)
                .guestId(guestId)
                .hostGiftId(hostGiftLetterId)
                .guestGiftId(guestGiftLetterId)
                .build());
    }

    public ChatRoomsResponseDto findMyChatRooms(Long memberId) {
        List<ChatRoomResponseDto> chatRooms = chatRoomRepository.findMyChatRooms(memberId)
                .stream()
                .map(chatRoom -> {
                    GiftLetter guestGiftLetter = giftLetterService.findById(chatRoom.getGuestGiftId());
                    Long receiverId = guestGiftLetter.getReceiverId();
                    String nickname;
                    if (receiverId.equals(memberId)) {
                        // 내가 받은 선물이므로 guestGiftLetter의 nickname 사용
                        nickname = guestGiftLetter.getNickname();
                    } else {
                        // 내가 보낸 선물이므로 hostGiftLetter의 nickname 조회
                        nickname = giftLetterService.findNicknameById(chatRoom.getHostGiftId());
                    }
                    return ChatRoomResponseDto.of(idEncryptionUtil.encrypt(chatRoom.getId()), nickname);
                })
                .collect(Collectors.toList());
        return ChatRoomsResponseDto.of(chatRooms);
    }


    public ChatLetterResponseDto findReceiveLetter(Long roomId, Long memberId) {
        ChatRoom chatRoom = chatRoomRepository.findChatRoom(roomId);
        GiftLetter hostGiftLetter = giftLetterService.findById(chatRoom.getHostGiftId());
        if (hostGiftLetter.getReceiverId().equals(memberId)) {
            // 이미 조회한 hostGiftLetter 재사용
            return ChatLetterResponseDto.of(giftLetterService.toGiftLetterDetailResponseDto(hostGiftLetter));
        } else {
            GiftLetter guestGiftLetter = giftLetterService.findById(chatRoom.getGuestGiftId());
            return ChatLetterResponseDto.of(giftLetterService.toGiftLetterDetailResponseDto(guestGiftLetter));
        }
    }
}
