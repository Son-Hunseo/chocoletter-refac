package chocolate.chocoletter.api.giftbox.service;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.domain.AlarmType;
import chocolate.chocoletter.api.alarm.service.AlarmService;
import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxIdResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxTypeResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.MyUnBoxingTimesResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.UnboxingTimesResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.VerifyIsSendResponseDto;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.api.member.service.MemberService;
import chocolate.chocoletter.common.exception.BadRequestException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import chocolate.chocoletter.common.util.DateTimeUtil;
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
    private final GiftService giftService;
    private final LetterService letterService;
    private final ChatRoomService chatRoomService;
    private final DateTimeUtil dateTimeUtil;
    private final IdEncryptionUtil idEncryptionUtil;
    private final GiftRepository giftRepository;
    private final MemberService memberService;
    private final AlarmService alarmService;

    @Transactional
    public void sendGeneralFreeGift(Long senderId, Long giftBoxId, GeneralFreeGiftRequestDto requestDto) {
        Gift gift = generateGeneralGift(senderId, giftBoxId);
        Letter letter = Letter.createGeneralLetter(gift, requestDto.nickName(), requestDto.content());
        letterService.saveLetter(letter);

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();

    }

    @Transactional
    public void sendGeneralQuestionGift(Long senderId, Long giftBoxId, GeneralQuestionRequestDto requestDto) {
        Gift gift = generateGeneralGift(senderId, giftBoxId);
        Letter letter = Letter.createQuestionLetter(gift, requestDto.nickName(), requestDto.question(),
                requestDto.answer());
        letterService.saveLetter(letter);

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();
    }

    @Transactional
    public void sendSpecialFreeGift(Long senderId, Long giftBoxId, SpecialFreeGiftRequestDto requestDto) {
        Gift gift = generateSpecialGift(senderId, giftBoxId, requestDto.unBoxingTime());
        Letter letter = Letter.createGeneralLetter(gift, requestDto.nickName(), requestDto.content());
        letterService.saveLetter(letter);

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();

        Alarm alarm = Alarm.builder()
                .type(AlarmType.RECEIVE_SPECIAL)
                .giftId(gift.getId())
                .member(memberService.findMember(gift.getReceiverId()))
                .partnerName(letter.getNickname())
                .build();
        alarmService.save(alarm);
    }

    @Transactional
    public void sendSpecialQuestionGift(Long senderId, Long giftBoxId, SpecialQuestionGiftRequestDto requestDto) {
        Gift gift = generateSpecialGift(senderId, giftBoxId, requestDto.unBoxingTime());
        Letter letter = Letter.createQuestionLetter(gift, requestDto.nickName(), requestDto.question(),
                requestDto.answer());
        letterService.saveLetter(letter);

        Optional<Member> member = memberRepository.findById(senderId);
        Member sendMember = member.get();
        sendMember.increaseSendGiftCount();

        Alarm alarm = Alarm.builder()
                .type(AlarmType.RECEIVE_SPECIAL)
                .giftId(gift.getId())
                .member(memberService.findMember(gift.getReceiverId()))
                .partnerName(letter.getNickname())
                .build();
        alarmService.save(alarm);
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

    public UnboxingTimesResponseDto findUnBoxingTimes(Long giftBoxId, Long memberId) {
        return UnboxingTimesResponseDto.of(
                giftService.findReceiverUnboxingTimes(findGiftBox(giftBoxId).getMember().getId(), memberId));
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
    public Gift generateGeneralGift(Long senderId, Long giftBoxId) {
        checkGiftExists(senderId, giftBoxId);
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        Gift gift = Gift.createGeneralGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId());
        giftService.saveGift(gift);
        makeChattingRoom(gift.getReceiverId(), gift.getSenderId(), gift.getId());
        receiverGiftBox.addGiftCount();
        receiverGiftBox.addGeneralGiftCount();
        return gift;
    }

    @Transactional
    public Gift generateSpecialGift(Long senderId, Long giftBoxId, String unBoxingTime) {
        checkGiftExists(senderId, giftBoxId);
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        Gift gift = Gift.createSpecialGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId(),
                dateTimeUtil.parseTimeToDateTime(unBoxingTime));
        giftService.saveGift(gift);
        receiverGiftBox.addGiftCount();
        return gift;
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

    private void checkGiftExists(Long senderId, Long giftBoxId) {
        if (giftService.findMyGift(senderId, giftBoxId)) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_EXISTS_GIFT);
        }
    }

    @Transactional
    public void makeChattingRoom(Long senderId, Long receiverId, Long senderGiftId) {
        Gift receiverGift = giftService.findGeneralGiftEachOther(senderId, receiverId);
        if (receiverGift != null) {
            chatRoomService.saveChatRoom(senderId, receiverId, senderGiftId, receiverGift.getId());
        }
    }

    public MyUnBoxingTimesResponseDto findMyUnbBoxingTimes(Long memberId) {
        return giftService.findMyUnBoxingTimes(memberId);
    }

    @Transactional
    public VerifyIsSendResponseDto findVerifyIsSend(Long giftBoxId, Long memberId) {
        boolean isSend = giftRepository.findGiftBySenderIdAndGiftBoxId(memberId, giftBoxId) != null;
        return VerifyIsSendResponseDto.of(isSend);
    }

    public GiftDetailResponseDto findMyGiftDetail(Long giftBoxId, Long memberId) {
        Gift myGift = giftService.findMyGiftDetail(giftBoxId, memberId);
        if (myGift == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT);
        }
        if (myGift.getIsOpened()) {
            throw new BadRequestException(ErrorMessage.ERR_GIFT_ALREADY_OPENED);
        }
        return giftService.findSendGiftDetail(memberId, myGift.getId());
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
