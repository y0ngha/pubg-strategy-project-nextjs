```plaintext
app/
 ├── __tests__/                     # [Tests] 계층별 테스트 코드
 │    ├── domain/                   #   - 엔티티 및 비즈니스 규칙 단위 테스트
 │    ├── application/              #   - 유스케이스 흐름 검증
 │    └── infrastructure/           #   - 외부 API 연동 테스트
 │
 ├── domain/                        # [Core] 순수 비즈니스 로직
 │    ├── strategy/                 #   [Bounded Context: 전략]
 │    │    ├── entities/            #      - Strategy Aggregate Root
 │    │    ├── port/                #      - Repository Interface
 │    │    ├── value-objects/       #      - Position, TeamLabel...
 │    │    └── exceptions/          #      - 도메인 규칙 예외
 │    ├── user/                     #   [Bounded Context: 사용자]
 │    └── shared/                   #   [Shared Kernel] 공통 VO 및 예외
 │
 ├── application/                   # [Use Case] 오케스트레이션 계층
 │    ├── strategy/
 │    │    ├── use-cases/           #      - 실제 비즈니스 시나리오
 │    │    └── dto/                 #      - 계층 간 데이터 전송 객체
 │    └── user/
 │
 ├── infrastructure/                # [Adapter] 외부 시스템 구현체
 │    ├── http/                     #   - 공통 Axios/Fetch 클라이언트
 │    ├── strategy/
 │    │    └── adapter/             #   - HttpStrategyRepository
 │    └── config/                   #   - 환경 변수 및 설정
 │
 ├── presentation/                  # [Interface] 사용자 진입점
 │    ├── friend/actions/           #   - Server Actions
 │    └── user/actions/
 │
 └── global/                        # [Config] 전역 설정
      └── di/                       #   - InversifyJS 의존성 주입 컨테이너 설정
           ├── client/              #      - 클라이언트 사이드 DI
           ├── server/              #      - 서버 사이드 DI
           └── types/               #      - DI Symbols
```