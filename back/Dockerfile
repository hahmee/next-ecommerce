# JDK 없는 런타임 이미지를 기반으로
FROM amazoncorretto:17
# 작업 디렉토리 설정
WORKDIR /usr/src/app

# Github Actions에서 빌드한 JAR 파일을 복사
COPY app.jar ./app.jar

EXPOSE 8080
# 실행 명령어
CMD ["java", "-jar", "app.jar"]

