package org.zerock.mallapi.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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

    if (request.getMethod().equals("OPTIONS")) return true;
    if (path.startsWith("/api/member/")) return true;
    if (path.startsWith("/api/reviews/")) return true;
    if (path.startsWith("/api/healthcheck")) return true;
    if (path.startsWith("/api/toss/confirm")) return true;
    if (path.startsWith("/api/public/")) return true;

    return false;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
          throws ServletException, IOException {

    log.info("🌐 JWTCheckFilter 시작");

    try {
      String authHeaderStr = request.getHeader("Authorization");

      if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
        throw new AuthenticationCredentialsNotFoundException("Authorization 헤더 없음 또는 형식 오류");
      }

      String accessToken = authHeaderStr.substring(7); // "Bearer " 이후
      Map<String, Object> claims = JWTUtil.validateToken(accessToken);

      // 클레임에서 사용자 정보 추출
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

      MemberDTO memberDTO = new MemberDTO(email, password, nickname, social, roleNames, encryptedId, createdAt, updatedAt);

      // 인증 객체 생성 및 설정
      UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(memberDTO, password, memberDTO.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authToken);


      log.info("인증 성공: {}", memberDTO.getEmail());

      filterChain.doFilter(request, response);

    } catch (Exception e) {
      log.warn("JWT 인증 실패: {}", e.getMessage());

      // 예외를 던져 Spring Security의 AuthenticationEntryPoint가 처리하게 함
      throw new AuthenticationCredentialsNotFoundException("JWT 인증 실패: " + e.getMessage(), e);
    }
  }
}
