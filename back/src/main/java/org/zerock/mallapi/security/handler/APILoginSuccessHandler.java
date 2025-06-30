package org.zerock.mallapi.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import java.util.Map;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
          throws IOException, ServletException {

    log.info("=== 로그인 성공 ===");

    // 1. 사용자 정보
    MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
    Map<String, Object> claims = memberDTO.getClaims();

    // 2. JWT 토큰 발급 (access 60분, refresh 1일)
    String accessToken = JWTUtil.generateToken(claims, 60);       // 60분
    String refreshToken = JWTUtil.generateToken(claims, 60 * 24); // 1일

    // 3. HttpOnly + Secure + SameSite=None 설정 쿠키 생성
    ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
            .httpOnly(true)
            .secure(false) // HTTPS일 때만 동작, 개발 환경에서는 false 가능
            .sameSite("Lax") // 개발 환경에서는 Lax
            .path("/")
            .maxAge(Duration.ofMinutes(60))
            .build();

    ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofDays(1))
            .build();

    // 4. 응답 헤더에 쿠키 추가
    response.addHeader("Set-Cookie", accessCookie.toString());
    response.addHeader("Set-Cookie", refreshCookie.toString());

    // 5. 클라이언트에 응답 JSON 보내기
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
