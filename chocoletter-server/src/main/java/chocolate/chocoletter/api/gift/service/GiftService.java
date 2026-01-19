package chocolate.chocoletter.api.gift.service;

import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.service.MemberService;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftService {
    private final GiftRepository giftRepository;
    private final LetterService letterService;
    private final ChatRoomService chatRoomService;
    private final MemberService memberService;
    private final IdEncryptionUtil idEncryptionUtil;
    private final GiftBoxRepository giftBoxRepository;

    public GiftsResponseDto findAllGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findAllGift(memberId);
        List<GiftResponseDto> giftResponseDtos = gifts.stream()
                .map(gift -> {
                    String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
                    return GiftResponseDto.of(gift, encryptedGiftId);
                })
                .collect(Collectors.toList());

        return GiftsResponseDto.of(giftResponseDtos);
    }

    public GiftsResponseDto findSpecialGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.SPECIAL);
        List<GiftResponseDto> giftResponseDtos = gifts.stream()
                .map(gift -> {
                    String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
                    return GiftResponseDto.of(gift, encryptedGiftId);
                })
                .collect(Collectors.toList());

        return GiftsResponseDto.of(giftResponseDtos);
    }

    @Transactional
    public GiftDetailResponseDto findReceiveGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getReceiverId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.openGift();
        String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
        LetterDto letter = letterService.findLetter(giftId);
        return GiftDetailResponseDto.of(encryptedGiftId, letter);
    }

    public GiftDetailResponseDto findSendGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getSenderId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
        LetterDto letter = letterService.findLetter(giftId);
        return GiftDetailResponseDto.of(encryptedGiftId, letter);
    }

    public GiftsResponseDto findGeneralGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.GENERAL);
        List<GiftResponseDto> giftResponseDtos = gifts.stream()
                .map(gift -> {
                    String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
                    return GiftResponseDto.of(gift, encryptedGiftId);
                })
                .collect(Collectors.toList());

        return GiftsResponseDto.of(giftResponseDtos);
    }

    @Transactional
    public void saveGift(Gift gift) {
        giftRepository.save(gift);
    }

    public boolean findMyGift(Long senderId, Long giftBoxId) {
        return giftRepository.findGiftBySenderIdAndGiftBoxId(senderId, giftBoxId) != null;
    }

    public Gift findGeneralGiftEachOther(Long senderId, Long receiverId) {
        return giftRepository.findGeneralGiftBySenderIdAndReceiverId(senderId, receiverId, GiftType.GENERAL);
    }

    @Transactional
    public void modifyGift(Long memberId, Long giftId, ModifyLetterRequestDto requestDto) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getSenderId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        letterService.modifyLetter(giftId, requestDto);
    }

    public Gift findMyGiftDetail(Long giftBoxId, Long memberId) {
        return giftRepository.findMyGift(giftBoxId, memberId);
    }
}
