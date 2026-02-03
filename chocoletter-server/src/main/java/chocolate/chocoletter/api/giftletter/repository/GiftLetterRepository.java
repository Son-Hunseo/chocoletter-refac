package chocolate.chocoletter.api.giftletter.repository;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftLetterRepository extends JpaRepository<GiftLetter, Long> {
    Optional<GiftLetter> findBySenderIdAndGiftBoxId(Long senderId, Long giftBoxId);
}
