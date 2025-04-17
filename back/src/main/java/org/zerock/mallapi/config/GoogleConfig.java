package org.zerock.mallapi.config;

import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class GoogleConfig {

    @Bean
    public GoogleCredentials googleCredentials() throws IOException {
        // 환경 변수에서 Google Credentials 파일 경로 가져오기
        String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");

        if (credentialsPath == null || credentialsPath.isEmpty()) {
            throw new IOException("환경 변수 'GOOGLE_APPLICATION_CREDENTIALS'가 설정되지 않았습니다.");
        }

        File credentialsFile = new File(credentialsPath);
        if (!credentialsFile.exists()) {
            throw new IOException("Google Credentials 파일을 찾을 수 없습니다: " + credentialsPath);
        }

        try (InputStream credentialsStream = new FileInputStream(credentialsFile)) {
            return GoogleCredentials.fromStream(credentialsStream);
        }
    }
}
