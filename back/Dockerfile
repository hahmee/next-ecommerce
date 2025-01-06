# JDK 17을 사용하는 이미지를 선택
FROM bellsoft/liberica-openjdk-alpine:17

# Gradle을 사용하는 경우, Gradle wrapper 파일을 복사하여 빌드 실행
# Gradle wrapper 파일 복사
COPY gradlew /usr/src/app/gradlew
COPY gradle /usr/src/app/gradle
COPY src /usr/src/app/src
COPY build.gradle /usr/src/app/build.gradle
COPY settings.gradle /usr/src/app/settings.gradle


# Gradle 빌드 명령어 실행 (JAR 파일을 빌드)
WORKDIR /usr/src/app


# Gradle 실행 권한 추가
RUN chmod +x gradlew

# Gradle 빌드 명령어 실행
RUN ./gradlew clean build -x test

# 빌드된 JAR 파일을 app.jar로 복사
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

# 컨테이너에서 사용할 포트 설정
EXPOSE 8080

# JAR 파일을 실행하는 명령어
ENTRYPOINT ["java", "-jar", "/usr/src/app/app.jar"]
