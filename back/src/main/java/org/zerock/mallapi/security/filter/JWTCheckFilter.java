package org.zerock.mallapi.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import com.google.gson.Gson;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

    // Preflight요청은 체크하지 않음 
    if(request.getMethod().equals("OPTIONS")){
      return true;
    }

    String path = request.getRequestURI();

    log.info("check uri..............!!!!!" + path);

    //api/member/ 경로의 호출은 체크하지 않음 
    if(path.startsWith("/api/member/")) {
      log.info("ssdddddddddsssddddd");
      return true;
    }

    //이미지 조회 경로는 체크하지 않는다면 
    if(path.startsWith("/api/products/view/")) {
      return true;
    }

    return false;
  }


  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    //인가과정
    log.info("------------------------JWTCheckFilter.......................");


    //request에서 Authorization찾음
    String authHeaderStr = request.getHeader("Authorization");

    log.info("whatdfdfdkfdkf" + authHeaderStr);

    try {
      //Bearer accestoken...
      String accessToken = authHeaderStr.substring(7);
      Map<String, Object> claims = JWTUtil.validateToken(accessToken); //accessToken 검증

      log.info("JWT claims: dddddddd" + claims);

      //filterChain.doFilter(request, response); //이하 추가 

      String email = (String) claims.get("email");
      String password = (String) claims.get("password");
      String nickname = (String) claims.get("nickname");
      Boolean social = (Boolean) claims.get("social");
      List<String> roleNames = (List<String>) claims.get("roleNames");

      MemberDTO memberDTO = new MemberDTO(email, password, nickname, social.booleanValue(), roleNames);

      log.info("-----------------------------------");
      log.info(memberDTO);
      log.info(memberDTO.getAuthorities());

      UsernamePasswordAuthenticationToken authenticationToken
      = new UsernamePasswordAuthenticationToken(memberDTO, password, memberDTO.getAuthorities());

      //SecurityContextHolder에 정보를 저장한다.
      SecurityContextHolder.getContext().setAuthentication(authenticationToken);

      //확인용 -> 지우기
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      log.info("--------authentication : " + authentication);
      log.info("--------principal : " + authentication.getPrincipal());

      filterChain.doFilter(request, response);

    }catch(Exception e){

      log.error("JWT Check Error..............");
      log.error(e.getMessage());

      Gson gson = new Gson();
      String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

      response.setContentType("application/json");
      PrintWriter printWriter = response.getWriter();
      printWriter.println(msg);
      printWriter.close();

    }
  }


}
