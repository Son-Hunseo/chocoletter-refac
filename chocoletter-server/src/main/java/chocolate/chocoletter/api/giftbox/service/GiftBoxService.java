package chocolate.chocoletter.api.giftbox.service;

import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxIdResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxTypeResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.VerifyIsSendResponseDto;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.service.GiftLetterService;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.exception.BadRequestException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftBoxService {
    private final MemberRepository memberRepository;
    private final GiftBoxRepository giftBoxRepository;
    private final GiftLetterService giftLetterService;
    private final ChatRoomService chatRoomService;
    private final IdEncryptionUtil idEncryptionUtil;

    @Transactional
    public void sendGeneralFreeGiftLetter(Long senderId, Long giftBoxId, GeneralFreeGiftLetterRequestDto requestDto) {
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        GiftLetter giftLetter = generateGiftLetter(senderId, receiverGiftBox, requestDto.nickName(), requestDto.content(), null, null);

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();
    }

    @Transactional
    public void sendGeneralQuestionGiftLetter(Long senderId, Long giftBoxId, GeneralQuestionGiftLetterRequestDto requestDto) {
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        GiftLetter giftLetter = generateQuestionGiftLetter(senderId, receiverGiftBox, requestDto.nickName(), requestDto.question(), requestDto.answer());

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();
    }

    @Transactional
    public void sendSpecialFreeGiftLetter(Long senderId, Long giftBoxId, SpecialFreeGiftLetterRequestDto requestDto) {
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        GiftLetter giftLetter = generateGiftLetter(senderId, receiverGiftBox, requestDto.nickName(), requestDto.content(), null, null);

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();
    }

    @Transactional
    public void sendSpecialQuestionGiftLetter(Long senderId, Long giftBoxId, SpecialQuestionGiftLetterRequestDto requestDto) {
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        GiftLetter giftLetter = generateQuestionGiftLetter(senderId, receiverGiftBox, requestDto.nickName(), requestDto.question(), requestDto.answer());

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();
    }

    public GiftCountResponseDto findGiftCount(Long memberId) {
        GiftBox giftBox = giftBoxRepository.findGiftBoxByMemberId(memberId);
        return GiftCountResponseDto.of(giftBox);
    }

    public GiftBoxResponseDto findFriendGiftBox(Long giftBoxId) {
        GiftBox friendGiftBox = findGiftBox(giftBoxId);
        String encryptedGiftBoxId = idEncryptionUtil.encrypt(friendGiftBox.getId());
        return GiftBoxResponseDto.of(friendGiftBox, encryptedGiftBoxId, calcGiftBoxFillLevel(friendGiftBox));
    }

    @Transactional
    public void usePreviewCount(Long memberId) {
        GiftBox myGiftBox = giftBoxRepository.findGiftBoxByMemberId(memberId);
        if (myGiftBox.getGeneralGiftCount() < 2) {
            throw new BadRequestException(ErrorMessage.ERR_NOT_ENOUGH_PREVIEW_GIFT_COUNT);
        }
        myGiftBox.usePreviewCount();
    }

    @Transactional
    public GiftLetter generateGiftLetter(Long senderId, GiftBox receiverGiftBox, String nickname, String content, String question, String answer) {
        checkGiftLetterExists(senderId, receiverGiftBox.getId());
        Long receiverId = receiverGiftBox.getMember().getId();

        GiftLetter giftLetter = giftLetterService.createGeneralFreeGiftLetter(
                receiverGiftBox, senderId, receiverId, nickname, content);

        makeChattingRoom(receiverId, senderId, giftLetter.getId());
        receiverGiftBox.addGiftCount();
        receiverGiftBox.addGeneralGiftCount();
        return giftLetter;
    }

    @Transactional
    public GiftLetter generateQuestionGiftLetter(Long senderId, GiftBox receiverGiftBox, String nickname, String question, String answer) {
        checkGiftLetterExists(senderId, receiverGiftBox.getId());
        Long receiverId = receiverGiftBox.getMember().getId();

        GiftLetter giftLetter = giftLetterService.createQuestionGiftLetter(
                receiverGiftBox, senderId, receiverId, nickname, question, answer);

        makeChattingRoom(receiverId, senderId, giftLetter.getId());
        receiverGiftBox.addGiftCount();
        receiverGiftBox.addGeneralGiftCount();
        return giftLetter;
    }

    public GiftBoxIdResponseDto findGiftBoxIdByMemberId(Long memberId) {
        Optional<GiftBox> giftBox = giftBoxRepository.findByMemberId(memberId);
        GiftBox targetGiftBox = giftBox.orElse(null);
        return GiftBoxIdResponseDto.of(idEncryptionUtil.encrypt(targetGiftBox.getId()));
    }

    public GiftBoxTypeResponseDto findGiftBoxTypeByMemberId(Long memberId) {
        Optional<GiftBox> giftBox = giftBoxRepository.findByMemberId(memberId);
        GiftBox targetGiftBox = giftBox.orElse(null);
        return GiftBoxTypeResponseDto.of(targetGiftBox.getType());
    }

    private GiftBox findGiftBox(Long giftBoxId) {
        GiftBox receiverGiftBox = giftBoxRepository.findGiftBoxByGiftBoxId(giftBoxId);
        if (receiverGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT_BOX);
        }
        return receiverGiftBox;
    }

    private void checkGiftLetterExists(Long senderId, Long giftBoxId) {
        if (giftLetterService.existsBySenderIdAndGiftBoxId(senderId, giftBoxId)) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_EXISTS_GIFT);
        }
    }

    @Transactional
    public void makeChattingRoom(Long receiverId, Long senderId, Long senderGiftLetterId) {
        GiftLetter receiverGiftLetter = giftLetterService.findBySenderAndReceiver(receiverId, senderId);
        if (receiverGiftLetter != null) {
            chatRoomService.saveChatRoom(receiverId, senderId, senderGiftLetterId, receiverGiftLetter.getId());
        }
    }

    @Transactional
    public VerifyIsSendResponseDto findVerifyIsSend(Long giftBoxId, Long memberId) {
        boolean isSend = giftLetterService.existsBySenderIdAndGiftBoxId(memberId, giftBoxId);
        return VerifyIsSendResponseDto.of(isSend);
    }

    public GiftLetterDetailResponseDto findMyGiftLetterDetail(Long giftBoxId, Long memberId) {
        GiftLetter myGiftLetter = giftLetterService.findBySenderAndReceiver(memberId,
                findGiftBox(giftBoxId).getMember().getId());
        if (myGiftLetter == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT);
        }
        if (myGiftLetter.getIsOpened()) {
            throw new BadRequestException(ErrorMessage.ERR_GIFT_ALREADY_OPENED);
        }
        return giftLetterService.findSendGiftLetterDetail(memberId, myGiftLetter.getId());
    }

    @Transactional
    public void chooseGiftBoxType(Long memberId, GiftBoxTypeRequestDto giftBoxTypeRequestDto) {
        GiftBox giftBox = giftBoxRepository.findGiftBoxByMemberId(memberId);
        giftBox.updateGiftType(giftBoxTypeRequestDto.type());
    }

    public Integer calcGiftBoxFillLevel(GiftBox giftBox) {
        if (giftBox.getGiftCount() == 0) {
            return 1;
        }
        if (1 <= giftBox.getGiftCount() && giftBox.getGiftCount() <= 9) {
            return 2;
        }
        return 3;
    }
}
