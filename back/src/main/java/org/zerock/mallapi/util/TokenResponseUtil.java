package org.zerock.mallapi.util;

import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.MemberDTO;

import java.util.HashMap;
import java.util.Map;

public class TokenResponseUtil {

    public static DataResponseDTO<Map<String, Object>> create(MemberDTO memberDTO, Object paymentData) {
        Map<String, Object> claims = memberDTO.getClaims();
        String accessToken = JWTUtil.generateToken(claims, 60);
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("accessToken", accessToken);
        responseMap.put("refreshToken", refreshToken);
        responseMap.put("member", memberDTO);
        responseMap.put("payment", paymentData);

        return DataResponseDTO.of(responseMap);
    }
}
