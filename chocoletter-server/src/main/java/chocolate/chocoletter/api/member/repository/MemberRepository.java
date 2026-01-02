package chocolate.chocoletter.api.member.repository;

import chocolate.chocoletter.api.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findById(Long id);

    Optional<Member> findBySocialId(String socialId);
}