# 베이스 이미지로 OpenJDK 17을 사용
FROM openjdk:17-slim AS build

# 기본 패키지 설치
RUN apt-get update && apt-get install -y bash

WORKDIR /app

# 필요한 파일들을 복사
COPY build.gradle .
COPY settings.gradle .
COPY gradle/ gradle/
COPY gradlew .
RUN chmod +x gradlew

# 의존성 다운로드(캐싱)
RUN ./gradlew dependencies

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
RUN ./gradlew clean build -x test  

# 빌드 결과물을 실행할 새로운 스테이지
FROM openjdk:17-slim

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/chat-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "app.jar"]
