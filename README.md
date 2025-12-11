# 기본 정보
- `Node`: v25.2.1 (Reelase. 2025.11.16)
- `Next`: v16 (Release. 2025.10.21)
- `Yarn`: v4.12.0 (Release. 2025.11.23)

> 문서
> [Technical specifications](docs/Technical_specifications.md)

# 아키텍처
- Hexagonal Architecture

> 문서 
> [Hexagonal Architecture](docs/Architecture.md)

# 설계 방법론 및 사용할 디자인 패턴
- Domain Driven Development
- Test Driven Development
- Dependency Injection (with Inversify)
- Repository Pattern
- Application Service Pattern
- Server Actions Pattern
- DTO + Validation Pattern (Zod 라이브러리 사용)

> 문서 
> [Design Pattern](docs/Design_Pattern.md)
> [Design methodology concretization](docs/Design_methodology_concretization.md)

# 요구사항
> 문서
> [Requests](docs/Requests.md)

# 설계 문서
> 문서 
> [Domain Design](docs/Domain_Design.md)

# 실행방법
1. Node 25.2.1 버전 설치
2. `npm install -g yarn`
3. 폴더에 들어와서 `yarn install`
4. `yarn dev` 로 개발서버 실행