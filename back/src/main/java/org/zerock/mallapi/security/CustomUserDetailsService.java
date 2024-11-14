package org.zerock.mallapi.security;

import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * CustomUSerDetailsService
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{

  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

    log.info("----------------loadUserByUsername-----------------------------" + email);

    Member member = memberRepository.getWithRoles(email);

    if(member == null){
      throw new UsernameNotFoundException("Not Found");
    }

    MemberDTO memberDTO = new MemberDTO(
            member.getEmail(),
            member.getPassword(),
            member.getNickname(),
            member.isSocial(),
            member.getMemberRoleList()
                    .stream()
                    .map(memberRole -> memberRole.name()).collect(Collectors.toList()),
            member.getEncryptedId());

    log.info(memberDTO);

    return memberDTO;

  }
  
}
