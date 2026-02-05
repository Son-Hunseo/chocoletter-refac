package chocolate.chocoletter.api.giftletter.repository;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftLetterRepository extends JpaRepository<GiftLetter, Long> {
    Optional<GiftLetter> findBySenderIdAndGiftBoxId(Long senderId, Long giftBoxId);

    @Query("select g from GiftLetter g where g.receiverId = :receiverId")
    List<GiftLetter> findAllByReceiverId(@Param("receiverId") Long receiverId);

    @Query("select g from GiftLetter g where g.senderId = :senderId and g.receiverId = :receiverId")
    Optional<GiftLetter> findBySenderIdAndReceiverId(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("select g from GiftLetter g where g.giftBox.id = :giftBoxId and g.senderId = :senderId")
    Optional<GiftLetter> findByGiftBoxIdAndSenderId(@Param("giftBoxId") Long giftBoxId, @Param("senderId") Long senderId);

    default GiftLetter findByIdOrThrow(Long id) {
        return findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT));
    }
}
