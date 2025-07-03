package org.zerock.mallapi.util;

import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.MemberDTO;

import java.util.HashMap;
import java.util.Map;

import static org.zerock.mallapi.util.TokenConstants.ACCESS_EXPIRE_MINUTES;
import static org.zerock.mallapi.util.TokenConstants.REFRESH_EXPIRE_MINUTES;

//변경 요망
public class TokenResponseUtil {

    public static DataResponseDTO<Map<String, Object>> create(MemberDTO memberDTO) {
        Map<String, Object> claims = memberDTO.getClaims();
        String accessToken = JWTUtil.generateToken(claims, ACCESS_EXPIRE_MINUTES);
        String refreshToken = JWTUtil.generateToken(claims, REFRESH_EXPIRE_MINUTES);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("accessToken", accessToken);
        responseMap.put("refreshToken", refreshToken);
        responseMap.put("member", memberDTO);

        return DataResponseDTO.of(responseMap);
    }
}
