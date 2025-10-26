package org.zerock.mallapi.util;

public class TokenConstants {
    public static final int ACCESS_EXPIRE_MINUTES = 10;          // access_token 유효 시간 (10분)
    public static final int REFRESH_EXPIRE_MINUTES = 60 * 24 * 7;    // refresh_token 유효 시간 (7일)
    public static final int REFRESH_REISSUE_THRESHOLD_MINUTES = 60; // 재발급 임계값 (1시간 남았을 때)
}
