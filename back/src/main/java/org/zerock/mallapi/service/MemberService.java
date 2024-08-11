package org.zerock.mallapi.service;

import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;

@Transactional
public interface MemberService {
  
  MemberDTO getKakaoMember(String accessToken);

  void modifyMember(MemberModifyDTO memberModifyDTO);

  MemberDTO register(MemberDTO memberDTO);

  default MemberDTO entityToDTO(Member member) {

    MemberDTO dto = new MemberDTO(
      member.getEmail(), 
      member.getPw(), 
      member.getNickname(), 
      member.isSocial(), 
      member.getMemberRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList()));

    return dto;
  }

}
