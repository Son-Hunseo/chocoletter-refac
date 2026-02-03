package chocolate.chocoletter.api.giftletter.service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.LetterType;
import chocolate.chocoletter.common.util.LetterEncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftLetterService {
    private final GiftLetterRepository giftLetterRepository;
    private final LetterEncryptionUtil letterEncryptionUtil;

    @Transactional
    public void saveGiftLetter(Gift gift, Letter letter) {
        GiftLetter giftLetter;
        if (letter.getType() == LetterType.FREE) {
            giftLetter = GiftLetter.createGeneralGiftLetter(
                    gift.getGiftBox(),
                    gift.getSenderId(),
                    gift.getReceiverId(),
                    letter.getNickname(),
                    letter.getContent()
            );
        } else {
            giftLetter = GiftLetter.createQuestionGiftLetter(
                    gift.getGiftBox(),
                    gift.getSenderId(),
                    gift.getReceiverId(),
                    letter.getNickname(),
                    letter.getQuestion(),
                    letter.getAnswer()
            );
        }
        giftLetterRepository.save(giftLetter);
    }

    @Transactional
    public void modifyGiftLetter(Long senderId, Long giftBoxId, ModifyLetterRequestDto requestDto) {
        giftLetterRepository.findBySenderIdAndGiftBoxId(senderId, giftBoxId)
                .ifPresent(giftLetter -> {
                    String encryptedContent = letterEncryptionUtil.encrypt(requestDto.content());
                    String encryptedAnswer = letterEncryptionUtil.encrypt(requestDto.answer());
                    giftLetter.modify(requestDto.nickName(), requestDto.question(), encryptedAnswer, encryptedContent);
                });
    }

    @Transactional
    public void openGiftLetter(Long senderId, Long giftBoxId) {
        giftLetterRepository.findBySenderIdAndGiftBoxId(senderId, giftBoxId)
                .ifPresent(GiftLetter::openGift);
    }
}
