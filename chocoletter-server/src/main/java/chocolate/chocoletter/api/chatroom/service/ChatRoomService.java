package chocolate.chocoletter.api.chatroom.service;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.dto.response.ChatLetterResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.common.event.giftletter.ChatRoomGiftQuery;
import chocolate.chocoletter.common.event.giftletter.GiftLetterEntityQuery;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import chocolate.chocoletter.common.util.LetterEncryptionUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final IdEncryptionUtil idEncryptionUtil;
    private final LetterEncryptionUtil letterEncryptionUtil;

    public ChatRoomsResponseDto findMyChatRooms(Long memberId) {
        List<ChatRoomResponseDto> chatRooms = chatRoomRepository.findMyChatRooms(memberId)
                .stream()
                .map(chatRoom -> {
                    ChatRoomGiftQuery query = new ChatRoomGiftQuery(
                            chatRoom.getHostGiftId(), chatRoom.getGuestGiftId());
                    eventPublisher.publishEvent(query);

                    String nickname = query.getGuestReceiverId().equals(memberId)
                            ? query.getGuestSenderNickname()
                            : query.getHostSenderNickname();

                    return ChatRoomResponseDto.of(idEncryptionUtil.encrypt(chatRoom.getId()), nickname);
                })
                .collect(Collectors.toList());
        return ChatRoomsResponseDto.of(chatRooms);
    }

    public ChatLetterResponseDto findReceiveLetter(Long roomId, Long memberId) {
        ChatRoom chatRoom = chatRoomRepository.findChatRoom(roomId);

        GiftLetterEntityQuery hostQuery = new GiftLetterEntityQuery(chatRoom.getHostGiftId());
        eventPublisher.publishEvent(hostQuery);
        GiftLetter hostGiftLetter = hostQuery.getResult();

        if (hostGiftLetter.getReceiverId().equals(memberId)) {
            String encryptedGiftLetterId = idEncryptionUtil.encrypt(hostGiftLetter.getId());
            String decryptedContent = letterEncryptionUtil.decrypt(hostGiftLetter.getContent());
            String decryptedAnswer = letterEncryptionUtil.decrypt(hostGiftLetter.getAnswer());
            return ChatLetterResponseDto.of(GiftLetterDetailResponseDto.of(encryptedGiftLetterId, hostGiftLetter, decryptedContent, decryptedAnswer));
        } else {
            GiftLetterEntityQuery guestQuery = new GiftLetterEntityQuery(chatRoom.getGuestGiftId());
            eventPublisher.publishEvent(guestQuery);
            GiftLetter guestGiftLetter = guestQuery.getResult();

            String encryptedGiftLetterId = idEncryptionUtil.encrypt(guestGiftLetter.getId());
            String decryptedContent = letterEncryptionUtil.decrypt(guestGiftLetter.getContent());
            String decryptedAnswer = letterEncryptionUtil.decrypt(guestGiftLetter.getAnswer());
            return ChatLetterResponseDto.of(GiftLetterDetailResponseDto.of(encryptedGiftLetterId, guestGiftLetter, decryptedContent, decryptedAnswer));
        }
    }
}
