package chocolate.chocoletter.api.gift.repository;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {

    @Query("select g from Gift g where g.receiverId = :receiverId")
    List<Gift> findAllGift(@Param("receiverId") Long receiverId);

    @Query("select g from Gift g where g.id = :giftId")
    Gift findGiftById(@Param("giftId") Long giftId);

    @Query("select g from Gift g where g.senderId = :senderId and g.giftBox.id = :giftBoxId")
    Gift findGiftBySenderIdAndGiftBoxId(Long senderId, Long giftBoxId);

    @Query("select g from Gift g where g.senderId = :senderId and g.receiverId = :receiverId")
    Gift findGiftBySenderIdAndReceiverId(Long senderId, Long receiverId);

    @Query("select g from Gift g where g.giftBox.id = :giftBoxId and g.senderId = :memberId")
    Gift findMyGift(@Param("giftBoxId") Long giftBoxId, @Param("memberId") Long memberId);

    default Gift findGiftByIdOrThrow(Long giftId) {
        return findById(giftId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT));
    }

}
