package chocolate.chocoletter.api.chatroom.service;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.dto.response.ChatLetterResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import chocolate.chocoletter.common.util.LetterEncryptionUtil;
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
    private final GiftLetterRepository giftLetterRepository;
    private final IdEncryptionUtil idEncryptionUtil;
    private final LetterEncryptionUtil letterEncryptionUtil;

    public ChatRoomsResponseDto findMyChatRooms(Long memberId) {
        List<ChatRoomResponseDto> chatRooms = chatRoomRepository.findMyChatRooms(memberId)
                .stream()
                .map(chatRoom -> {
                    GiftLetter guestGiftLetter = giftLetterRepository.findByIdOrThrow(chatRoom.getGuestGiftId());
                    Long receiverId = guestGiftLetter.getReceiverId();
                    String nickname;
                    if (receiverId.equals(memberId)) {
                        nickname = guestGiftLetter.getNickname();
                    } else {
                        nickname = giftLetterRepository.findNicknameById(chatRoom.getHostGiftId());
                    }
                    return ChatRoomResponseDto.of(idEncryptionUtil.encrypt(chatRoom.getId()), nickname);
                })
                .collect(Collectors.toList());
        return ChatRoomsResponseDto.of(chatRooms);
    }

    public ChatLetterResponseDto findReceiveLetter(Long roomId, Long memberId) {
        ChatRoom chatRoom = chatRoomRepository.findChatRoom(roomId);
        GiftLetter hostGiftLetter = giftLetterRepository.findByIdOrThrow(chatRoom.getHostGiftId());
        if (hostGiftLetter.getReceiverId().equals(memberId)) {
            String encryptedGiftLetterId = idEncryptionUtil.encrypt(hostGiftLetter.getId());
            String decryptedContent = letterEncryptionUtil.decrypt(hostGiftLetter.getContent());
            String decryptedAnswer = letterEncryptionUtil.decrypt(hostGiftLetter.getAnswer());
            return ChatLetterResponseDto.of(GiftLetterDetailResponseDto.of(encryptedGiftLetterId, hostGiftLetter, decryptedContent, decryptedAnswer));
        } else {
            GiftLetter guestGiftLetter = giftLetterRepository.findByIdOrThrow(chatRoom.getGuestGiftId());
            String encryptedGiftLetterId = idEncryptionUtil.encrypt(guestGiftLetter.getId());
            String decryptedContent = letterEncryptionUtil.decrypt(guestGiftLetter.getContent());
            String decryptedAnswer = letterEncryptionUtil.decrypt(guestGiftLetter.getAnswer());
            return ChatLetterResponseDto.of(GiftLetterDetailResponseDto.of(encryptedGiftLetterId, guestGiftLetter, decryptedContent, decryptedAnswer));
        }
    }
}
