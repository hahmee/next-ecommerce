package org.zerock.mallapi.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.zerock.mallapi.exception.ErrorCode;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
@Component
public class JWTUtil {

  @Value("${jwt.secret}")
  private String secretKey;

  private static String key;

  @PostConstruct
  public void init() {
    key = this.secretKey;  // Spring이 초기화된 후 값 설정
    log.info("JWT Secret Key Initialized: " + key);  // 초기화 로그 추가
  }


  public static String generateToken(Map<String, Object> valueMap, int min) {

    SecretKey key = null;

    try{
      key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

    }catch(Exception e){
        throw new RuntimeException(e.getMessage());
    }


    String jwtStr = Jwts.builder()
            .setHeader(Map.of("typ","JWT"))
            .setClaims(valueMap)
            .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
//            .setExpiration(Date.from(ZonedDateTime.now().plusSeconds(min).toInstant()))
            .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
            .signWith(key)
            .compact();


    return jwtStr;
  }

  public static Map<String, Object> validateToken(String token) {

    log.info("token..... " + token);
    Map<String, Object> claim = null;
    
    try{

      SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

      claim = Jwts.parserBuilder()
              .setSigningKey(key)
              .build()
              .parseClaimsJws(token) // 파싱 및 검증, 실패 시 에러
              .getBody();


    }catch(MalformedJwtException malformedJwtException){
      throw new GeneralException(ErrorCode.INVALID_TOKEN, "MALFORMED");
    }catch(ExpiredJwtException expiredJwtException){
      throw new GeneralException(ErrorCode.EXPIRED_TOKEN, "EXPIRED");
    }catch(InvalidClaimException invalidClaimException){
      throw new GeneralException(ErrorCode.INVALID_TOKEN, "INVALID");
    }catch(JwtException jwtException){
      throw new GeneralException(ErrorCode.INVALID_TOKEN, "JWT_ERROR");
    }catch(Exception e){
      throw new GeneralException(ErrorCode.INVALID_TOKEN, "ERROR");
    }

    return claim;
  }

}
