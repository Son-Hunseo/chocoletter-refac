package chocolate.chocoletter.api.giftletter.service;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.domain.Question;
import chocolate.chocoletter.api.giftletter.dto.request.FreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.request.ModifyGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.request.QuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLettersResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.VerifyIsSendResponseDto;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import chocolate.chocoletter.api.giftletter.repository.QuestionRepository;
import chocolate.chocoletter.common.event.chatroom.ChatRoomCreateEvent;
import chocolate.chocoletter.common.event.giftbox.GiftBoxCountIncrementEvent;
import chocolate.chocoletter.common.event.giftbox.GiftBoxQuery;
import chocolate.chocoletter.common.event.member.MemberSendCountIncrementEvent;
import chocolate.chocoletter.common.exception.BadRequestException;
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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftLetterService {
    private final GiftLetterRepository giftLetterRepository;
    private final QuestionRepository questionRepository;

    private final ApplicationEventPublisher eventPublisher;

    private final LetterEncryptionUtil letterEncryptionUtil;
    private final IdEncryptionUtil idEncryptionUtil;

    /**
     * 조회
     */

    @Transactional
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

        String encryptedGiftLetterId = idEncryptionUtil.encrypt(giftLetter.getId());
        String decryptedContent = letterEncryptionUtil.decrypt(giftLetter.getContent());
        String decryptedAnswer = letterEncryptionUtil.decrypt(giftLetter.getAnswer());
        return GiftLetterDetailResponseDto.of(encryptedGiftLetterId, giftLetter, decryptedContent, decryptedAnswer);
    }

    @Transactional
    public GiftLetterDetailResponseDto findSendGiftLetterDetail(Long memberId, Long giftLetterId) {
        GiftLetter giftLetter = giftLetterRepository.findByIdOrThrow(giftLetterId);
        if (!memberId.equals(giftLetter.getSenderId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        String encryptedGiftLetterId = idEncryptionUtil.encrypt(giftLetter.getId());
        String decryptedContent = letterEncryptionUtil.decrypt(giftLetter.getContent());
        String decryptedAnswer = letterEncryptionUtil.decrypt(giftLetter.getAnswer());
        return GiftLetterDetailResponseDto.of(encryptedGiftLetterId, giftLetter, decryptedContent, decryptedAnswer);
    }

    @Transactional
    public GiftLetterDetailResponseDto findMyGiftLetterDetail(Long giftBoxId, Long memberId) {
        GiftLetter giftLetter = giftLetterRepository.findByGiftBoxIdAndSenderId(giftBoxId, memberId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT));
        String encryptedGiftLetterId = idEncryptionUtil.encrypt(giftLetter.getId());
        String decryptedContent = letterEncryptionUtil.decrypt(giftLetter.getContent());
        String decryptedAnswer = letterEncryptionUtil.decrypt(giftLetter.getAnswer());
        return GiftLetterDetailResponseDto.of(encryptedGiftLetterId, giftLetter, decryptedContent, decryptedAnswer);
    }

    /**
     * 전송
     */

    @Transactional
    public void sendFreeGiftLetter(Long senderId, Long giftBoxId, FreeGiftLetterRequestDto requestDto) {
        GiftBoxQuery giftBoxQuery = new GiftBoxQuery(giftBoxId);
        eventPublisher.publishEvent(giftBoxQuery);
        GiftBox receiverGiftBox = giftBoxQuery.getResult();
        if (receiverGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT_BOX);
        }

        if (giftLetterRepository.findBySenderIdAndGiftBoxId(senderId, giftBoxId).isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_EXISTS_GIFT);
        }

        Long receiverId = receiverGiftBox.getMember().getId();
        String encryptedContent = letterEncryptionUtil.encrypt(requestDto.content());
        GiftLetter giftLetter = GiftLetter.createFreeGiftLetter(
                receiverGiftBox, senderId, receiverId, requestDto.nickName(), encryptedContent);
        giftLetterRepository.save(giftLetter);

        GiftLetter receiverGiftLetter = giftLetterRepository.findBySenderIdAndReceiverId(receiverId, senderId).orElse(null);
        if (receiverGiftLetter != null) {
            eventPublisher.publishEvent(new ChatRoomCreateEvent(
                    receiverId, senderId, giftLetter.getId(), receiverGiftLetter.getId()));
        }

        eventPublisher.publishEvent(new GiftBoxCountIncrementEvent(giftBoxId));
        eventPublisher.publishEvent(new MemberSendCountIncrementEvent(senderId));
    }

    @Transactional
    public void sendQuestionGiftLetter(Long senderId, Long giftBoxId, QuestionGiftLetterRequestDto requestDto) {
        GiftBoxQuery giftBoxQuery = new GiftBoxQuery(giftBoxId);
        eventPublisher.publishEvent(giftBoxQuery);
        GiftBox receiverGiftBox = giftBoxQuery.getResult();
        if (receiverGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT_BOX);
        }

        if (giftLetterRepository.findBySenderIdAndGiftBoxId(senderId, giftBoxId).isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_EXISTS_GIFT);
        }

        Long receiverId = receiverGiftBox.getMember().getId();
        String encryptedAnswer = letterEncryptionUtil.encrypt(requestDto.answer());
        GiftLetter giftLetter = GiftLetter.createQuestionGiftLetter(
                receiverGiftBox, senderId, receiverId, requestDto.nickName(), requestDto.question(), encryptedAnswer);
        giftLetterRepository.save(giftLetter);

        GiftLetter receiverGiftLetter = giftLetterRepository.findBySenderIdAndReceiverId(receiverId, senderId).orElse(null);
        if (receiverGiftLetter != null) {
            eventPublisher.publishEvent(new ChatRoomCreateEvent(
                    receiverId, senderId, giftLetter.getId(), receiverGiftLetter.getId()));
        }

        eventPublisher.publishEvent(new GiftBoxCountIncrementEvent(giftBoxId));
        eventPublisher.publishEvent(new MemberSendCountIncrementEvent(senderId));
    }

    /**
     * 수정
     */

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

    /**
     * 이미 대상에게 편지를 보냈는지 검증
     */

    @Transactional
    public VerifyIsSendResponseDto verifyIsSend(Long giftBoxId, Long memberId) {
        boolean isSend = giftLetterRepository.findBySenderIdAndGiftBoxId(memberId, giftBoxId).isPresent();
        return VerifyIsSendResponseDto.of(isSend);
    }


    /**
     * 랜덤 질문 조회
     */

    @Transactional
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
