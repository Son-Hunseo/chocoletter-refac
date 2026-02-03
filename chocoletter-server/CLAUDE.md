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
├── gift/        # Gift CRUD, sender/receiver views
├── giftbox/     # Gift container per user
├── letter/      # Letter content (FREE or QUESTION type)
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
@GetMapping("/{giftId}/receive")
public ResponseEntity<?> getGift(@DecryptedId @PathVariable Long giftId)
```

**Exception Handling:** Use custom exceptions from `common/exception/` - they map to HTTP status codes:
- `BadRequestException` (400), `UnAuthorizedException` (401), `ForbiddenException` (403), `NotFoundException` (404), `InternalServerException` (500)

**Repository Pattern:** Repositories have `findByIdOrThrow()` default methods that throw `NotFoundException`.

### Database Entities

- **Member** - OAuth2 user (socialId, profileImgUrl, sendGiftCount)
- **Gift** - Links sender, receiver, and GiftBox; has one Letter
- **GiftBox** - One per member, tracks gift counts
- **Letter** - FREE (content only) or QUESTION (question + answer) type
- **ChatRoom** - Host/guest model for real-time messaging
- **Question** - Database of questions for QUESTION-type letters

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
