package org.zerock.mallapi.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler{

@Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

  log.info("-------------------------------------");
  log.info("-----authentication--------" + authentication);
  log.info("-------------------------------------");

  MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

  Map<String, Object> claims = memberDTO.getClaims();

  // 토큰 종류(카테고리), 유저이름, 역할 등을 페이로드에 담는다.
  String accessToken = JWTUtil.generateToken(claims, 1); // 한시간 60
  String refreshToken = JWTUtil.generateToken(claims,   10); // 하루 60 * 24

  claims.put("accessToken", accessToken);
  claims.put("refreshToken", refreshToken);

  log.info("-------------accessToken" + accessToken);

  log.info("-------------refreshToken" + refreshToken);

  Map loginData =  Map.of("success", true, "code", 0, "message", "Ok", "data", claims);

  Gson gson = new Gson();

  String jsonStr = gson.toJson(loginData);

  response.setContentType("application/json; charset=UTF-8");
  PrintWriter printWriter = response.getWriter();
  printWriter.println(jsonStr);
  printWriter.close();

}

  
}
