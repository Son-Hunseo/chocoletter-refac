package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        return memberRepository.findById(Long.parseLong(id))
//                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_USER));
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}