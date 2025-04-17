package org.zerock.mallapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TossPaymentConfig {

    @Value("${payment.toss.confirm.url}")
    public static String tossConfirmUrl;

    @Value("${payment.toss.client.key}")
    private String clientKey;

    @Value("${payment.toss.secret.key}")
    private String secretKey;

}
