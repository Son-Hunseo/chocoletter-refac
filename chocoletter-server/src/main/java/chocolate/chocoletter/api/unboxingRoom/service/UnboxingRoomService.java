package chocolate.chocoletter.api.unboxingRoom.service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.dto.response.HasAccessUnboxingRoomResponseDto;
import chocolate.chocoletter.api.unboxingRoom.repository.UnboxingRoomRepository;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.exception.NotFoundException;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnboxingRoomService {
    private final UnboxingRoomRepository unboxingRoomRepository;
    private final LetterService letterService;
    private final IdEncryptionUtil idEncryptionUtil;

    @Transactional
    public void saveUnboxingRoom(UnboxingRoom unboxingRoom) {
        unboxingRoomRepository.save(unboxingRoom);
    }

    public HasAccessUnboxingRoomResponseDto hasAccessToUnboxingRoom(Long memberId, Long unboxingRoomId) {
        UnboxingRoom unboxingRoom = unboxingRoomRepository.findByIdOrThrow(unboxingRoomId);
        if (unboxingRoom.getIsEnd()) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN_UNBOXING_ROOM_ALREADY_END);
        }
        if (isMemberNotAuthorized(memberId, unboxingRoom)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        Gift gift = unboxingRoom.getGift();
        LetterDto letter = letterService.findLetter(gift.getId());
        String encryptGiftId = idEncryptionUtil.encrypt(gift.getId());
        GiftDetailResponseDto giftDetail = GiftDetailResponseDto.of(encryptGiftId, letter);
        return HasAccessUnboxingRoomResponseDto.of(unboxingRoom.getStartTime(), giftDetail);
    }

    @Transactional
    public void endUnBoxingRoom(Long memberId, Long roomId) {
        UnboxingRoom unboxingRoom = unboxingRoomRepository.findUnboxingRoomByRoomId(roomId);
        if (unboxingRoom == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_UNBOXING_ROOM);
        }
        if (isMemberNotAuthorized(memberId, unboxingRoom)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        unboxingRoom.endRoom();
    }

    private boolean isMemberNotAuthorized(Long memberId, UnboxingRoom unboxingRoom) {
        return !unboxingRoom.getReceiverId().equals(memberId) && !unboxingRoom.getSenderId().equals(memberId);
    }

    public Map<Long, Long> findUnBoxingRoomIdsByGiftIds(List<Long> giftIds) {
        List<Object[]> results = unboxingRoomRepository.findUnBoxingRoomIdsByGiftIds(giftIds);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],  // giftId
                        row -> (Long) row[1]  // unboxingRoomId
                ));
    }

    public List<UnboxingRoom> findUpcomingUnboxingRoomsIn30Minutes() {
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime targetTime = now.plusMinutes(30);
        return unboxingRoomRepository.findUpcomingUnboxingRoomsTargetTime(targetTime, targetTime.plusMinutes(1));
    }
}

