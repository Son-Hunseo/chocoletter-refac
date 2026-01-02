package chocolate.chocoletter.api.unboxingRoom.repository;

import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UnboxingRoomRepository extends JpaRepository<UnboxingRoom, Long> {

    default UnboxingRoom findByIdOrThrow(Long unboxingRoomId) {
        return findById(unboxingRoomId).orElseThrow(
                () -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_UNBOXING_ROOM)
        );
    }

    @Query("select r from UnboxingRoom r where r.id = :roomId")
    UnboxingRoom findUnboxingRoomByRoomId(Long roomId);

    @Query("select r.gift.id, r.id from UnboxingRoom r where r.gift.id in :giftIds")
    List<Object[]> findUnBoxingRoomIdsByGiftIds(@Param("giftIds") List<Long> giftIds);

    @Query("select r from UnboxingRoom r where r.startTime >= :startTargetTime and r.startTime < :endTargetTime")
    List<UnboxingRoom> findUpcomingUnboxingRoomsTargetTime(
            @Param("startTargetTime") LocalDateTime startTargetTime,
            @Param("endTargetTime") LocalDateTime endTargetTime
    );
}
