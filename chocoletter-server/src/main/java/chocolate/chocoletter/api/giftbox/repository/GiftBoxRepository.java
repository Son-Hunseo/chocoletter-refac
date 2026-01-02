package chocolate.chocoletter.api.giftbox.repository;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiftBoxRepository extends JpaRepository<GiftBox, Long> {
    @Query("select gb from GiftBox gb join fetch gb.member where gb.id = :giftBoxId")
    GiftBox findGiftBoxByGiftBoxId(@Param("giftBoxId") Long giftBoxId);

    @Query("select gb from GiftBox gb where gb.member.id = :memberId")
    GiftBox findGiftBoxByMemberId(@Param("memberId") Long memberId);

    Optional<GiftBox> findByMemberId(Long memberId);
}
