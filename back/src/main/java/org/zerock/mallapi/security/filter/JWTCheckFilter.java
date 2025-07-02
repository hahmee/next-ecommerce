package org.zerock.mallapi.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getRequestURI();

    // 인증이 필요 없는 public API들은 필터 제외
    return request.getMethod().equals("OPTIONS") ||
            path.startsWith("/api/member/") ||
            path.startsWith("/api/reviews/") ||
            path.startsWith("/api/healthcheck") ||
            path.startsWith("/api/toss/confirm") ||
            path.startsWith("/api/public/");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
          throws ServletException, IOException {

    log.info("🌐 JWTCheckFilter 시작 (쿠키 기반)");

    try {
      String accessToken = null;

      // HTTPOnly 쿠키에서 access_token 추출
      if (request.getCookies() != null) {
        for (Cookie cookie : request.getCookies()) {
          if ("access_token".equals(cookie.getName())) {
            accessToken = cookie.getValue();
            break;
          }
        }
      }

      log.info("accessToken......? " + accessToken); //undefined

      if (accessToken == null || "undefined".equals(accessToken) || accessToken.isBlank()) {
        throw new AuthenticationCredentialsNotFoundException("access_token 쿠키가 없습니다.");
      }


      // JWT 검증 및 클레임 파싱
      Map<String, Object> claims = JWTUtil.validateToken(accessToken);

      String email = (String) claims.get("email");
      String password = (String) claims.get("password");
      String nickname = (String) claims.get("nickname");
      Boolean social = (Boolean) claims.get("social");
      List<MemberRole> roleNames = ((List<String>) claims.get("roleNames"))
              .stream()
              .map(MemberRole::valueOf)
              .collect(Collectors.toList());
      String encryptedId = (String) claims.get("encryptedId");
      LocalDateTime createdAt = (LocalDateTime) claims.get("createdAt");
      LocalDateTime updatedAt = (LocalDateTime) claims.get("updatedAt");

      MemberDTO memberDTO = new MemberDTO(
              email, password, nickname, social, roleNames, encryptedId, createdAt, updatedAt
      );

      // Spring Security 인증 컨텍스트 설정
      UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(memberDTO, password, memberDTO.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authToken);

      log.info("인증 성공: {}", memberDTO.getEmail());

      filterChain.doFilter(request, response);

    } catch (Exception e) {
      log.warn("JWT 인증 실패: {}", e.getMessage());
      throw new AuthenticationCredentialsNotFoundException("JWT 인증 실패: " + e.getMessage(), e);
    }
  }
}
