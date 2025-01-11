#=========================================================================
## BUILD STAGE 1 - JRE 추출
FROM amazoncorretto:17-alpine3.18 as builder-jre

# Step 2: binutils 패키지 설치 (오브젝트 파일을 복사하거나 변환시 필요)
RUN apk add --no-cache binutils

# Step 3: jlink를 사용하여 최소한의 JRE 생성
RUN $JAVA_HOME/bin/jlink \
         --module-path "$JAVA_HOME/jmods" \
         --verbose \
         --add-modules ALL-MODULE-PATH \
         --strip-debug \
         --no-man-pages \
         --no-header-files \
         --compress=2 \
         --output /jre && \
    rm -rf /jre/include /jre/lib/*.diz /jre/lib/*.a


#=========================================================================
## BUILD STAGE 2 - 빌드 단계
FROM amazoncorretto:17-alpine3.18 as builder-app

WORKDIR /usr/src/app

# Gradle 관련 파일 복사
COPY gradlew /usr/src/app/gradlew
COPY gradle /usr/src/app/gradle
COPY build.gradle /usr/src/app/build.gradle
COPY settings.gradle /usr/src/app/settings.gradle

# 소스 코드 복사
COPY src /usr/src/app/src

# Gradle 빌드 (테스트 제외)
RUN chmod +x gradlew && ./gradlew clean build -x test


#=========================================================================
## BUILD STAGE 3 - APP 실행
FROM alpine:3.18.4

# JRE 환경 설정
ENV JAVA_HOME=/jre
ENV PATH="$JAVA_HOME/bin:$PATH"

# JRE 복사
COPY --from=builder-jre /jre $JAVA_HOME

# Dockerize 설치
ENV DOCKERIZE_VERSION v0.2.0
RUN wget -q https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm -f dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && chmod +x /usr/local/bin/dockerize

# 빌드된 JAR 파일을 app.jar로 복사
COPY --from=builder-app /usr/src/app/build/libs/mallapi-0.0.1-SNAPSHOT.jar /usr/src/app/app.jar
# COPY --from=builder-app /usr/src/app/build/libs/*.jar /usr/src/app/app.jar ./
# COPY --from=builder-app /usr/src/app/build/libs/*.jar /usr/src/app/

# 컨테이너에서 사용할 포트 설정
EXPOSE 8080

# JAR 파일을 실행하는 명령어
CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "30s", "java", "-jar", "/usr/src/app/app.jar"]
# CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "30s", "java", "-jar", "/usr/src/app/*.jar"]


