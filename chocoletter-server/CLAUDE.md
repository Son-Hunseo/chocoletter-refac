# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chocoletter (초코레터) is a Java Spring Boot REST API backend for a gift-sharing social application. Users send "chocolate letters" (gifts with embedded messages) to each other, with support for real-time chat.

**Tech Stack:** Spring Boot 3.4.1, Java 17, MySQL, Spring Security with Kakao OAuth2, JWT, Socket.IO

## Build Commands

```bash
# Build (skip tests)
./gradlew clean build -x test

# Run tests
./gradlew test

# Run application locally
./gradlew bootRun

# Clean build
./gradlew clean
```

## Architecture

### Module Structure

The codebase follows a feature-based layered architecture under `src/main/java/chocolate/chocoletter/`:

```
api/
├── member/      # User auth (Kakao OAuth2) & profile
├── giftletter/  # GiftLetter CRUD, 선물 전송/검증
├── giftbox/     # Gift container per user, 선물함 관리
└── chatroom/    # Real-time chat between users

common/
├── config/      # Security, Swagger, JPA, Web configs
├── exception/   # Custom exceptions (BadRequest, NotFound, etc.)
├── filter/      # JWT authentication filter
├── handler/     # OAuth2 handlers, global exception handler
├── util/        # JWT, ID encryption, letter encryption utilities
└── annotation/  # @DecryptedId for encrypted path variables
```

### Key Patterns

**ID Encryption:** All resource IDs in URLs are AES-256 encrypted. Use `@DecryptedId` annotation on path variables to auto-decrypt:
```java
@GetMapping("/{giftLetterId}/receive")
public ResponseEntity<?> getGiftLetter(@DecryptedId @PathVariable Long giftLetterId)
```

**Exception Handling:** Use custom exceptions from `common/exception/` - they map to HTTP status codes:
- `BadRequestException` (400), `UnAuthorizedException` (401), `ForbiddenException` (403), `NotFoundException` (404), `InternalServerException` (500)

**Repository Pattern:** Repositories have `findByIdOrThrow()` default methods that throw `NotFoundException`.

**Letter Encryption:** Content and answer fields are encrypted using `LetterEncryptionUtil` before storage and decrypted on retrieval.

### Database Entities

- **Member** - OAuth2 user (socialId, profileImgUrl, sendGiftCount)
- **GiftLetter** - Consolidated entity combining gift and letter data
  - Links sender, receiver, and GiftBox
  - Contains letter content (FREE type: content only, QUESTION type: question + answer)
  - Unique constraint on (sender_id, gift_box_id)
- **GiftBox** - One per member, tracks gift counts
- **ChatRoom** - Host/guest model for real-time messaging (stores GiftLetter IDs)
- **Question** - Database of predefined questions (40 questions) for QUESTION-type letters

## API Endpoints

### GiftBox (`/api/v1/gift-box`)
- `GET /{giftBoxId}` - 친구 선물함 조회
- `GET /id` - 내 선물함 ID 조회
- `GET /type` - 선물함 타입 조회
- `PATCH /type` - 선물함 타입 선택
- `GET /count` - 내 선물 갯수 조회
- `PATCH /preview` - 미리보기 카운트 사용

### GiftLetter (`/api/v1/giftletter`)
- `GET /all` - 받은 선물 목록 조회
- `GET /{giftLetterId}/receive` - 받은 선물 상세 조회 (열기)
- `GET /{giftLetterId}/send` - 보낸 선물 상세 조회
- `GET /sent?giftBoxId=` - 내가 보낸 선물 조회
- `POST /free?giftBoxId=` - 자유 선물 전송
- `POST /question?giftBoxId=` - 질문 선물 전송
- `PATCH /{giftLetterId}` - 편지 수정
- `GET /verify?giftBoxId=` - 선물 전송 여부 검증
- `GET /question` - 랜덤 질문 조회
- `GET /count?giftBoxId=` - 특정 선물함의 선물 갯수 조회

### ChatRoom (`/api/v1/chat-room`)
- `GET /all` - 내 채팅방 목록 조회
- `GET /{roomId}/letter` - 채팅방 내 편지 조회

## Configuration

**Profiles:** `dev`, `prod`, `after` (A/B testing variant)

**Environment files:** `env/dev.env`, `env/prod.env` contain:
- Database: `DB_URL`, `DB_PORT`, `DB_SCHEMA`, `DB_USERNAME`, `DB_PASSWORD`
- OAuth2: `KAKAO_CLIENT_ID_CHOCO`, `ORIGIN_REDI_URL`
- Security: `JWT_SECRET`, `ENCRYPT_SECRET_KEY`, `LETTER_ENCRYPT_KEY`
- CORS: `ORIGIN_URL`

## API Documentation

Swagger UI available at `/swagger-ui/index.html` when running locally.

## Deployment

- Dockerfiles: `Dockerfile` (prod), `Dockerfile.after` (A/B test variant)
- Kubernetes manifests in `k8s/base/` with Kustomize overlays
