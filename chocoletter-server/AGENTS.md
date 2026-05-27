# Repository Guidelines

## Project Structure & Module Organization
This repository is a Java 17 / Spring Boot 3.4 REST API for Chocoletter. Application code lives under `src/main/java/chocolate/chocoletter/` and is organized by feature:

- `api/member`: Kakao OAuth2 login, JWT-backed member access, and my-page data.
- `api/giftbox`: one gift box per member, types, counts, and preview use.
- `api/giftletter`: free/question letters, sending, opening, and editing.
- `api/chatroom`: rooms created after mutual gift-letter exchange.
- `common`: security, encryption, exception handling, converters, and domain events.

Tests belong in `src/test/java/`. Runtime configuration is in `src/main/resources/application-*.yml`. Deployment assets are `Dockerfile*` and `k8s/` Kustomize manifests.

## Build, Test, and Development Commands
Use the Gradle wrapper from the repository root:

```bash
./gradlew test                  # Run JUnit/Spring Boot tests
./gradlew clean build -x test   # Build the application JAR without tests
./gradlew bootRun --args='--spring.profiles.active=dev' # Run locally
```

Local execution requires environment values referenced by the selected profile, including database, Kakao OAuth, JWT, and encryption keys.

## Coding Style & Naming Conventions
Follow the existing feature-layered package layout: `controller`, `service`, `repository`, `domain`, and `dto`. Use four-space indentation and standard Java naming: `PascalCase` classes, `camelCase` methods/fields, and DTO suffixes such as `RequestDto` and `ResponseDto`.

Prefer constructor injection with Lombok `@RequiredArgsConstructor`. Keep controller methods thin and place business rules in services. Use the repository's custom exceptions and `@DecryptedId` for externally supplied encrypted resource IDs. No formatter or lint configuration is currently committed; preserve surrounding style.

## Testing Guidelines
Testing uses JUnit 5 with `spring-boot-starter-test`. Existing coverage is minimal, so add focused tests for changed service rules, authorization checks, encryption handling, and repository interactions. Name test classes after the target class, for example `GiftLetterServiceTest`, and run `./gradlew test` before submitting.

## Security & Configuration Tips
Do not commit secrets or local environment files. Letter contents and answers are stored encrypted; avoid bypassing `LetterEncryptionUtil`. IDs exposed through APIs should be encrypted with `IdEncryptionUtil`.

## Commit & Pull Request Guidelines
History uses messages such as `[server - feat] 선물 갯수 조회 api 작성` and `chore(k8s): bump image tag ... [skip ci]`. Keep commits scoped and identify the area and change type.

Pull requests should describe behavior changed, list validation performed, note configuration or deployment impact, and include API request/response examples when contracts change.
