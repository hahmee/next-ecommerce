package org.zerock.mallapi.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.zerock.mallapi.security.CustomUserDetailsService;
import org.zerock.mallapi.security.filter.JWTCheckFilter;
import org.zerock.mallapi.security.handler.*;

import java.util.Arrays;
import java.util.List;

@Configuration
@Log4j2
@RequiredArgsConstructor
@EnableMethodSecurity
public class CustomSecurityConfig {

  private final CustomUserDetailsService customUserDetailsService;

  private final CookieProperties cookieProperties;


  @Value("${app.cors.allowed-origin}")
  private String allowedOrigin;

  @Bean
  public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    log.info("---------------------security config---------------------------");

    http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

    log.info("allowedOrigin value: {}", allowedOrigin);

    http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    http.csrf(csrf -> csrf.disable());

    http.formLogin(form -> {
      form.loginPage("/api/member/login");
      form.successHandler(new APILoginSuccessHandler(cookieProperties));
      form.failureHandler(new APILoginFailHandler());
    });

    http.logout(logout -> {
      logout.logoutUrl("/api/member/logout");
      logout.invalidateHttpSession(true);
      logout.logoutSuccessHandler(new APILogoutSuccessHandler(cookieProperties));
    });

    // 중요: authorizeHttpRequests 설정 추가
    http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/member/**").permitAll() // 로그인 관련은 모두 허용
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/toss/confirm").permitAll() //
            .requestMatchers("/api/me").permitAll()
            .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
    );

    // JWT 필터는 항상 UsernamePasswordAuthenticationFilter 앞에 위치해야 함
    http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);

    // 예외 핸들링 설정
    http.exceptionHandling(config -> {
      config.accessDeniedHandler(new CustomAccessDeniedHandler()); // 권한 없음 (403)
      config.authenticationEntryPoint(new CustomAuthenticationEntryPoint()); // 인증 실패 (401)
    });

    return http.build();
  }


  /** UsernameNotFoundException이 작동하지 않는 문제 **/
  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(customUserDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    provider.setHideUserNotFoundExceptions(false);  // 사용자 없음 예외 숨기지 않음
    return provider;
  }


  @Bean
  public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(List.of("http://localhost:3000", allowedOrigin));
    configuration.setAllowCredentials(true);
    configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));


    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }

}
