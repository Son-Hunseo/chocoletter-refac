package chocolate.chocoletter.api.giftbox.service;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxIdResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxTypeResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.common.event.giftletter.GiftLetterCountQuery;
import chocolate.chocoletter.common.exception.BadRequestException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftBoxService {
    private final GiftBoxRepository giftBoxRepository;
    private final IdEncryptionUtil idEncryptionUtil;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public GiftBoxResponseDto findFriendGiftBox(Long giftBoxId) {
        GiftBox friendGiftBox = giftBoxRepository.findGiftBoxByGiftBoxId(giftBoxId);
        if (friendGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT_BOX);
        }
        String encryptedGiftBoxId = idEncryptionUtil.encrypt(friendGiftBox.getId());
        GiftLetterCountQuery countQuery = new GiftLetterCountQuery(giftBoxId);
        eventPublisher.publishEvent(countQuery);
        Long giftCount = countQuery.getCount() != null ? countQuery.getCount() : 0L;
        return GiftBoxResponseDto.of(friendGiftBox, encryptedGiftBoxId, calcGiftBoxFillLevel(giftCount));
    }

    @Transactional
    public GiftBoxIdResponseDto findGiftBoxIdByMemberId(Long memberId) {
        Optional<GiftBox> giftBox = giftBoxRepository.findByMemberId(memberId);
        GiftBox targetGiftBox = giftBox.orElse(null);
        return GiftBoxIdResponseDto.of(idEncryptionUtil.encrypt(targetGiftBox.getId()));
    }

    @Transactional
    public GiftBoxTypeResponseDto findGiftBoxTypeByMemberId(Long memberId) {
        Optional<GiftBox> giftBox = giftBoxRepository.findByMemberId(memberId);
        GiftBox targetGiftBox = giftBox.orElse(null);
        return GiftBoxTypeResponseDto.of(targetGiftBox.getType());
    }

    @Transactional
    public void chooseGiftBoxType(Long memberId, GiftBoxTypeRequestDto giftBoxTypeRequestDto) {
        GiftBox giftBox = giftBoxRepository.findGiftBoxByMemberId(memberId);
        giftBox.updateGiftType(giftBoxTypeRequestDto.type());
    }

    @Transactional
    public GiftCountResponseDto findGiftCount(Long memberId) {
        GiftBox giftBox = giftBoxRepository.findGiftBoxByMemberId(memberId);
        return GiftCountResponseDto.of(giftBox);
    }

    @Transactional
    public void usePreviewCount(Long memberId) {
        GiftBox myGiftBox = giftBoxRepository.findGiftBoxByMemberId(memberId);
        if (myGiftBox.getGiftCount() < 2) {
            throw new BadRequestException(ErrorMessage.ERR_NOT_ENOUGH_PREVIEW_GIFT_COUNT);
        }
        myGiftBox.usePreviewCount();
    }

    // 선물함이 채워진 정도를 구별하기 위함 (1단계, 2단계, 3단계 선물함 이미지가 달라짐)
    public Integer calcGiftBoxFillLevel(Long giftCount) {
        if (giftCount == 0) {
            return 1;
        }
        if (1 <= giftCount && giftCount <= 9) {
            return 2;
        }
        return 3;
    }
}
