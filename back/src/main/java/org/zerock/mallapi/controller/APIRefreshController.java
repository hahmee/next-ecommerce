package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.service.MemberService;
import org.zerock.mallapi.util.GeneralException;
import org.zerock.mallapi.util.JWTUtil;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class APIRefreshController {

  private final MemberService memberService;

  @RequestMapping("/api/member/refresh")
  public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, String refreshToken, @RequestBody Map<String, String> emailObject){

    String email = emailObject.get("email");

    if(refreshToken == null) {
      throw new GeneralException(ErrorCode.NULL_TOKEN, "Refresh Token is null");
    }
    
    if(authHeader == null || authHeader.length() < 7) {
      throw new GeneralException(ErrorCode.INVALID_TOKEN, "Invalid string");
    }


    String accessToken = authHeader.substring(7);


    //Access 토큰 만료 X
    if(checkExpiredToken(accessToken) == false) { //ACCESS토큰 괜찮으면 여기 실행
      return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }

    /*Access토큰이 만료*/

    //Refresh토큰 검증
    Map<String, Object> claims = checkRefreshToken(refreshToken); //null(refreshToken 만료됨)

    /* Access, Refresh 둘 다 만료 */
    if (claims == null) { //refreshToken, accessToken 만료됨
      // 둘 다 새로 발급 필요.

      //이메일 받아서 정보 받기
      //서비스 호출
      MemberDTO memberDTO = memberService.get(email);


      claims = memberDTO.getClaims();

      log.info("claims...?" + claims);

      String newAccessToken = JWTUtil.generateToken(claims, 10);
      String newRefreshToken = JWTUtil.generateToken(claims, 60 * 24);


      return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken); //accessToken만 새로 발급, refresh 토큰은 기존값


    }else {  /* ACESS만료, Refresh 만료 X*/

      String newAccessToken = JWTUtil.generateToken(claims, 10);
      //근데 이제 refresh가 1시간 밖에 안남았다면 새로 발급해주기
      String newRefreshToken =  checkTime((Integer)claims.get("exp")) == true? JWTUtil.generateToken(claims, 60*24) : refreshToken;

      return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken); //accessToken만 새로 발급, refresh 토큰은 기존값

    }

  }

  //시간이 1시간 미만으로 남았다면
  private boolean checkTime(Integer exp) {

    //JWT exp를 날짜로 변환
    java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));

    //현재 시간과의 차이 계산 - 밀리세컨즈
    long gap   = expDate.getTime() - System.currentTimeMillis();

    //분단위 계산 
    long leftMin = gap / (1000 * 60);

    //1시간도 안남았는지.. 
    return leftMin < 60;
  }

  private boolean checkExpiredToken(String token) {

    try{
      JWTUtil.validateToken(token);  //여기서 에러남
    }catch(GeneralException ex) {//CustomJWTException
      if(ex.getMessage().equals("EXPIRED")){//Expired
          return true;
      }
    }
    return false;
  }


  private Map<String, Object> checkRefreshToken(String token) {
    Map<String, Object> claims = null;

    try {
      claims = JWTUtil.validateToken(token);  //여기서 에러남
    } catch (GeneralException ex) {//CustomJWTException
      if (ex.getMessage().equals("EXPIRED")) {//Expired
        return null;
      }
    }
    return claims;
  }

  
}
