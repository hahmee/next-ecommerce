package org.zerock.mallapi.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class APILogoutSuccessHandler implements AuthenticationSuccessHandler{

@Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

    log.info("-------------------------------------");
    log.info("-----authentication--------" + authentication);
    log.info("-------------------------------------");

    MemberDTO memberDTO = (MemberDTO)authentication.getPrincipal();

    Map<String, Object> claims = memberDTO.getClaims();

  // 토큰 종류(카테고리), 유저이름, 역할 등을 페이로드에 담는다.
  String accessToken = JWTUtil.generateToken(claims, 60);
    String refreshToken = JWTUtil.generateToken(claims,60*24);

    claims.put("accessToken", accessToken);
    claims.put("refreshToken", refreshToken);

    log.info("-------------accessToken" + accessToken);

    log.info("-------------refreshToken" + refreshToken);

    Gson gson = new Gson();

    String jsonStr = gson.toJson(claims);

    response.setContentType("application/json; charset=UTF-8");
    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.close();

  }

  
}
