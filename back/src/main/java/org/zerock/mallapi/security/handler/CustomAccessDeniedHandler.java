package org.zerock.mallapi.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Log4j2
public class CustomAccessDeniedHandler implements AccessDeniedHandler{

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

    Gson gson = new Gson();

    // 유저의 권한을 가져오기
    String role = request.getUserPrincipal() != null ? request.isUserInRole("ROLE_DEMO") ? "ROLE_DEMO" : "OTHER" : "UNKNOWN";

    String message;
    if ("ROLE_DEMO".equals(role)) {
      message = "데모 계정은 이 기능을 사용할 수 없습니다.";
    } else {
      message = "권한이 없습니다.";
    }

    String jsonStr = gson.toJson(Map.of(
            "success", false,
            "code", HttpStatus.FORBIDDEN.value(),
            "message", message
    ));

    response.setStatus(HttpStatus.FORBIDDEN.value());
    response.setContentType("application/json;charset=UTF-8");
    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.flush();
    printWriter.close();
  }

}
