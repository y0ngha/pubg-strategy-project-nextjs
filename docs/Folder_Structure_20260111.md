```plaintext
app/
 ├── (presentation)                 # 사용자 진입점 (UI)
 │    ├── (pages)                   #   - Next.js Route Groups (URL 라우팅)
 │    │    ├── (home)/              #      - 메인 페이지
 │    │    ├── login/               #      - 로그인 페이지
 │    │    ├── register/            #      - 회원가입 페이지
 │    │    └── strategies/          #      - 전략 목록/상세 페이지
 │    ├── friend/
 │    │    └── actions/             #   - [Primary Adapter] Friend 관련 Server Actions
 │    ├── shared/                   #   [Shared UI] 프레젠테이션 계층 공통 요소
 │    │    ├── components/          #      - 재사용 가능한 React 컴포넌트
 │    │    ├── constants/           #      - UI 전용 상수
 │    │    ├── helpers/             #      - UI 헬퍼 함수
 │    │    ├── hooks/               #      - Custom React Hooks
 │    │    ├── icons/               #      - SVG 아이콘 모음
 │    │    ├── types/               #      - UI 전용 타입 정의
 │    │    └── utils/               #      - 유틸리티 함수
 │    ├── strategy/
 │    │    └── actions/             #   - [Primary Adapter] Strategy 관련 Server Actions
 │    └── user/
 │         ├── actions/             #   - [Primary Adapter] User 관련 Server Actions
 │         └── services/            #    
 │
 ├── __tests__/                     # [Tests] 테스트 코드 모음
 │    ├── application/              #   - 유스케이스 및 흐름 검증
 │    ├── domain/                   #   - 엔티티, VO, 도메인 로직 단위 테스트
 │    ├── global/                   #   - DI 컨테이너 설정 테스트
 │    └── infrastructure/           #   - 외부 어댑터 테스트
 │
 ├── application/                   # [Use Case] 애플리케이션 비즈니스 흐름
 │    ├── constants/                #   - 애플리케이션 계층 상수
 │    ├── friend/
 │    │    ├── dto/                 #      
 │    │    └── use-cases/           #      
 │    ├── strategy/
 │    │    ├── dto/
 │    │    ├── mappers/             #      - Domain Entity <-> DTO 변환기
 │    │    ├── types/
 │    │    └── use-cases/           #      
 │    └── user/
 │         ├── dto/
 │         └── use-cases/
 │
 ├── dehydrate-components/          # [Utils] 데이터 Hydration 컴포넌트
 │
 ├── domain/                        # [Core] 비즈니스 로직
 │    ├── friend/                   #   [Bounded Context: 친구]
 │    │    ├── entities/            #      
 │    │    ├── enum/                #      
 │    │    ├── exceptions/          #      
 │    │    ├── port/                #      
 │    │    └── value-objects/       #      
 │    ├── shared/                   #   [Shared Kernel] 도메인 간 공통 요소
 │    │    ├── exceptions/
 │    │    └── value-objects/
 │    ├── strategy/                 #   [Bounded Context: 전략]
 │    │    ├── entities/
 │    │    ├── enums/
 │    │    ├── exceptions/
 │    │    ├── port/
 │    │    └── value-objects/
 │    └── user/                     #   [Bounded Context: 사용자]
 │         ├── entities/
 │         ├── enums/
 │         ├── exceptions/
 │         ├── port/
 │         ├── services/            #     
 │         └── value-objects/
 │
 ├── global/                        # [Config] 전역 설정 및 DI
 │    └── di/                       #   - 의존성 주입(InversifyJS) 설정
 │         ├── client/              #      - 클라이언트 컴포넌트용 DI 컨테이너
 │         ├── server/              #      - 서버 액션/API용 DI 컨테이너
 │         └── types/               #      - DI 식별자(Symbols) 정의
 │
 ├── infrastructure/                # [Adapter] 외부 시스템 구현체
 │    ├── config/                   #   - 환경 변수 및 인프라 설정
 │    │    └── environment-variables/
 │    ├── friend/
 │    │    └── adapter/             #      - FriendRepository 구현체
 │    ├── http/                     #   - 공통 HTTP 클라이언트 (Axios/Fetch Wrapper)
 │    ├── strategy/
 │    │    └── adapter/             #      - StrategyRepository 구현체
 │    └── user/
 │         └── adapter/             #      - UserRepository 구현체
 │
 ├── middlewares/                   # 요청 처리 미들웨어
 └── styles/                        # 전역 스타일 시트
```