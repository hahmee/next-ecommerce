package org.zerock.mallapi.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.zerock.mallapi.util.CustomJWTException;

@Log4j2
public class APILoginFailHandler implements AuthenticationFailureHandler{

  @Override
  public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException exception) throws IOException, ServletException {

      log.info("Login fail....." + exception);


    //throw new RuntimeException(""); //Exception 여기서 직접 던지면 안됨 (filter이므로)

    //스프링 시큐리티의 로그인 처리는 필터에서 수행되므로 스프링에서 제공하는 ExceptionHandler 를 사용할 수 없다! 직접 응답을 만들어 Response 객체에 작성해주자.

    Gson gson = new Gson();

    String jsonStr = gson.toJson(Map.of("error", "ERROR_LOGIN"));



    response.setContentType("application/json");

    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);

    printWriter.close();

  }

}
