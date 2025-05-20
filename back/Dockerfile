FROM amazoncorretto:17
WORKDIR /usr/src/app

# JAR 이름이 달라도 유연하게 대응
COPY build/libs/*.jar ./app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]