package org.zerock.mallapi.config;

import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class GAConfig {
    @Value("${google.credentials.path}")
    private String credentialsPath;

    @Bean
    public GoogleCredentials googleCredentials() throws IOException {
        try (InputStream credentialsStream = new FileInputStream(credentialsPath)) {
            return GoogleCredentials.fromStream(credentialsStream);
        }
    }
}
