package org.zerock.mallapi.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.service.MemberService;
import org.zerock.mallapi.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

  private final MemberService memberService;
  

  @GetMapping("/api/member/kakao")
  public Map<String,Object> getMemberFromKakao(String accessToken) {

    log.info("access Token ");
    log.info(accessToken);

    MemberDTO memberDTO = memberService.getKakaoMember(accessToken);

    Map<String, Object> claims = memberDTO.getClaims();

    String jwtAccessToken = JWTUtil.generateToken(claims, 60);
    String jwtRefreshToken = JWTUtil.generateToken(claims,60*24);

    claims.put("accessToken", jwtAccessToken);
    claims.put("refreshToken", jwtRefreshToken);

    return claims;
  }

  @PutMapping("/api/member/modify")
  public Map<String,String> modify(@RequestBody MemberModifyDTO memberModifyDTO) {

    log.info("member modify: " + memberModifyDTO);

    memberService.modifyMember(memberModifyDTO);

    return Map.of("result","modified");

  }


}
