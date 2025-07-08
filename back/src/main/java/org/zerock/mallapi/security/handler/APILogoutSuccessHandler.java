package org.zerock.mallapi.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseCookie;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.zerock.mallapi.config.CookieProperties;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@RequiredArgsConstructor
@Log4j2
public class APILogoutSuccessHandler implements LogoutSuccessHandler {


  private final CookieProperties cookieProperties;


  @Override
  public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.Authentication authentication) throws IOException {

    boolean isSecure = cookieProperties.isSecure();

    // 1. 쿠키 삭제 (maxAge 0으로 설정)
    ResponseCookie accessCookie = ResponseCookie.from("access_token", "")
            .path("/")
            .maxAge(0)
            .httpOnly(true)
            .secure(isSecure)
            .sameSite("Lax") // 프론트엔드와 cross-origin일 경우 필요
            .build();

    ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
            .path("/")
            .maxAge(0)
            .httpOnly(true)
            .secure(isSecure)
            .sameSite("Lax")
            .build();

    response.addHeader("Set-Cookie", accessCookie.toString());
    response.addHeader("Set-Cookie", refreshCookie.toString());

    // 2. JSON 응답 반환
    Map<String, Object> logoutData =  Map.of("success", true, "code", 0, "message", "Ok");

    Gson gson = new Gson();

    String jsonStr = gson.toJson(logoutData);

    response.setStatus(HttpServletResponse.SC_OK);
    response.setContentType("application/json; charset=UTF-8");

    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.close();


  }

  
}
