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
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
          throws IOException, ServletException {

    log.info("=== Authentication 성공 ===");
    MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

    Map<String, Object> claims = memberDTO.getClaims();

    String accessToken = JWTUtil.generateToken(claims, 60);      // 60분
    String refreshToken = JWTUtil.generateToken(claims, 60 * 24); // 1일


    // Set-Cookie 헤더 직접 작성 (SameSite=None 필요)
    String cookieAccess = "access_token=" + accessToken + "; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=None";
    String cookieRefresh = "refresh_token=" + refreshToken + "; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=None";

    response.addHeader("Set-Cookie", cookieAccess);
    response.addHeader("Set-Cookie", cookieRefresh);

    // 로그인 사용자 정보 일부 응답
    Map<String, Object> result = Map.of(
            "success", true,
            "code", 0,
            "message", "Login successful",
            "user", Map.of(
                    "email", memberDTO.getEmail(),
                    "nickname", memberDTO.getNickname(),
                    "roleNames", memberDTO.getRoleNames()
            )
    );

    response.setContentType("application/json; charset=UTF-8");
    PrintWriter writer = response.getWriter();
    writer.println(new Gson().toJson(result));
    writer.close();


  }
}
