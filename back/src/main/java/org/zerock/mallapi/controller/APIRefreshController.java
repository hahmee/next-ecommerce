package org.zerock.mallapi.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.config.CookieProperties;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.util.GeneralException;
import org.zerock.mallapi.util.JWTUtil;

import java.util.Map;

import static org.zerock.mallapi.util.TokenConstants.*;

@RestController
@RequiredArgsConstructor
@Log4j2
public class APIRefreshController {

  private final CookieProperties cookieProperties;

  @PostMapping("/api/member/refresh")
  public ResponseEntity<?> refresh(
          @CookieValue(value = "refresh_token", required = false) String refreshToken,
          HttpServletResponse response  // 응답 객체 추가

  ) {

    log.info("[APIRefresh] refresh_token = {}", refreshToken);
    // refresh_token이 없으면 재발급 자체가 불가능 → 예외 처리
    if (refreshToken == null || refreshToken.length() < 10) {
      throw new GeneralException(ErrorCode.INVALID_TOKEN, "Refresh Token이 유효하지 않습니다.");
    }


    // access_token은 만료됨 → refresh_token을 검증하여 재발급
    Map<String, Object> claims = extractClaimsIfValid(refreshToken);

    // refresh 토큰이 유효하지 않다면
    if (claims == null) {
      throw new GeneralException(ErrorCode.EXPIRED_TOKEN, "Refresh Token도 만료되었습니다. 다시 로그인해주세요.");
    }

    // Access 재발급
    String newAccessToken = JWTUtil.generateToken(claims, ACCESS_EXPIRE_MINUTES);

    String newRefreshToken = shouldReissueRefresh((Integer) claims.get("exp"))
            ? JWTUtil.generateToken(claims, REFRESH_EXPIRE_MINUTES)
            : refreshToken;

    boolean isSecure = cookieProperties.isSecure();

    // Set-Cookie로 내려주기
    ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccessToken)
            .httpOnly(true)
            .secure(isSecure)
            .sameSite("Lax")
            .path("/")
            .maxAge(ACCESS_EXPIRE_MINUTES * 60) // 초
            .build();

    ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", newRefreshToken)
            .httpOnly(true)
            .secure(isSecure)
            .sameSite("Lax")
            .path("/")
            .maxAge(REFRESH_EXPIRE_MINUTES * 60) // 초
            .build();

    response.addHeader("Set-Cookie", accessCookie.toString());
    response.addHeader("Set-Cookie", refreshCookie.toString());


    return ResponseEntity.ok().body(Map.of("message", "token refreshed"));

  }


  /** refresh_token이 유효하면 claim 리턴, 아니면 null */
  private Map<String, Object> extractClaimsIfValid(String token) {
    try {
      return JWTUtil.validateToken(token);
    } catch (GeneralException ex) {
      if (ErrorCode.EXPIRED_TOKEN.name().equals(ex.getErrorCode().name())) {
        return null; // 만료된 토큰인 경우..
      }
      throw ex; // 기타 예외는 그대로 던짐
    }
  }

  /** Refresh 토큰 만료까지 1시간도 안 남았는지 체크 */
  private boolean shouldReissueRefresh(Integer exp) {
    long now = System.currentTimeMillis();
    long expTime = ((long) exp) * 1000L;
    long remainingMin = (expTime - now) / (1000 * 60);
    return remainingMin < REFRESH_REISSUE_THRESHOLD_MINUTES;
  }
}
