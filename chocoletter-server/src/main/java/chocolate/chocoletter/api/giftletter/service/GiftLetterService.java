package chocolate.chocoletter.api.giftletter.service;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.domain.Question;
import chocolate.chocoletter.api.giftletter.dto.request.ModifyGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLettersResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import chocolate.chocoletter.api.giftletter.repository.QuestionRepository;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.exception.NotFoundException;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import chocolate.chocoletter.common.util.LetterEncryptionUtil;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftLetterService {
    private final GiftLetterRepository giftLetterRepository;
    private final QuestionRepository questionRepository;
    private final LetterEncryptionUtil letterEncryptionUtil;
    private final IdEncryptionUtil idEncryptionUtil;

    // ==================== 조회 ====================

    public GiftLettersResponseDto findAllGiftLetters(Long memberId) {
        List<GiftLetter> giftLetters = giftLetterRepository.findAllByReceiverId(memberId);
        List<GiftLetterResponseDto> giftLetterResponseDtos = giftLetters.stream()
                .map(giftLetter -> {
                    String encryptedGiftLetterId = idEncryptionUtil.encrypt(giftLetter.getId());
                    return GiftLetterResponseDto.of(giftLetter, encryptedGiftLetterId);
                })
                .collect(Collectors.toList());

        return GiftLettersResponseDto.of(giftLetterResponseDtos);
    }

    @Transactional
    public GiftLetterDetailResponseDto findReceiveGiftLetterDetail(Long memberId, Long giftLetterId) {
        GiftLetter giftLetter = giftLetterRepository.findByIdOrThrow(giftLetterId);
        if (!memberId.equals(giftLetter.getReceiverId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        giftLetter.openGift();

        return toGiftLetterDetailResponseDto(giftLetter);
    }

    public GiftLetterDetailResponseDto findSendGiftLetterDetail(Long memberId, Long giftLetterId) {
        GiftLetter giftLetter = giftLetterRepository.findByIdOrThrow(giftLetterId);
        if (!memberId.equals(giftLetter.getSenderId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        return toGiftLetterDetailResponseDto(giftLetter);
    }

    public GiftLetterDetailResponseDto findMyGiftLetterDetail(Long giftBoxId, Long memberId) {
        GiftLetter giftLetter = giftLetterRepository.findByGiftBoxIdAndSenderId(giftBoxId, memberId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT));
        return toGiftLetterDetailResponseDto(giftLetter);
    }

    /**
     * 이미 조회된 GiftLetter 객체를 DTO로 변환 (권한 체크 없음, 내부용)
     */
    public GiftLetterDetailResponseDto toGiftLetterDetailResponseDto(GiftLetter giftLetter) {
        String encryptedGiftLetterId = idEncryptionUtil.encrypt(giftLetter.getId());
        String decryptedContent = letterEncryptionUtil.decrypt(giftLetter.getContent());
        String decryptedAnswer = letterEncryptionUtil.decrypt(giftLetter.getAnswer());
        return GiftLetterDetailResponseDto.of(encryptedGiftLetterId, giftLetter, decryptedContent, decryptedAnswer);
    }

    public boolean existsBySenderIdAndGiftBoxId(Long senderId, Long giftBoxId) {
        return giftLetterRepository.findBySenderIdAndGiftBoxId(senderId, giftBoxId).isPresent();
    }

    public GiftLetter findBySenderAndReceiver(Long senderId, Long receiverId) {
        return giftLetterRepository.findBySenderIdAndReceiverId(senderId, receiverId).orElse(null);
    }

    public String findNicknameById(Long giftLetterId) {
        return giftLetterRepository.findNicknameById(giftLetterId);
    }

    public GiftLetter findById(Long giftLetterId) {
        return giftLetterRepository.findByIdOrThrow(giftLetterId);
    }

    // ==================== 생성 ====================

    @Transactional
    public GiftLetter createGeneralFreeGiftLetter(GiftBox giftBox, Long senderId, Long receiverId,
                                                   String nickname, String content) {
        String encryptedContent = letterEncryptionUtil.encrypt(content);
        GiftLetter giftLetter = GiftLetter.createGeneralGiftLetter(
                giftBox, senderId, receiverId, nickname, encryptedContent);
        return giftLetterRepository.save(giftLetter);
    }

    @Transactional
    public GiftLetter createQuestionGiftLetter(GiftBox giftBox, Long senderId, Long receiverId,
                                                String nickname, String question, String answer) {
        String encryptedAnswer = letterEncryptionUtil.encrypt(answer);
        GiftLetter giftLetter = GiftLetter.createQuestionGiftLetter(
                giftBox, senderId, receiverId, nickname, question, encryptedAnswer);
        return giftLetterRepository.save(giftLetter);
    }

    // ==================== 수정 ====================

    @Transactional
    public void modifyGiftLetterById(Long memberId, Long giftLetterId, ModifyGiftLetterRequestDto requestDto) {
        GiftLetter giftLetter = giftLetterRepository.findByIdOrThrow(giftLetterId);
        if (!memberId.equals(giftLetter.getSenderId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        String encryptedContent = letterEncryptionUtil.encrypt(requestDto.content());
        String encryptedAnswer = letterEncryptionUtil.encrypt(requestDto.answer());
        giftLetter.modify(requestDto.nickName(), requestDto.question(), encryptedAnswer, encryptedContent);
    }

    // ==================== Question ====================

    public RandomQuestionResponseDto findRandomQuestion(Long questionId) {
        Random random = new Random();
        Long randomId;
        if (questionId == 0) {
            randomId = random.nextLong(1, 41L);
        } else {
            do {
                randomId = random.nextLong(1, 41L);
            } while (randomId.equals(questionId));
        }
        Question question = questionRepository.findById(randomId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND));
        return RandomQuestionResponseDto.of(question);
    }
}
