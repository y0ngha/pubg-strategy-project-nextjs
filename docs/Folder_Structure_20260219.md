```plaintext
app/
 ├── (presentation)                 # [Interface] 사용자 진입점
 │    ├── (pages)                   #   - Next.js App Router
 │    │    ├── (home)/              #      - 메인 페이지
 │    │    ├── login/               #      - 로그인 페이지
 │    │    ├── my-page/             #      - 마이페이지
 │    │    ├── register/            #      - 회원가입 페이지
 │    │    └── strategies/          #      - 전술/전략 목록 및 상세 뷰 페이지
 │    ├── dehydrate-components/     #   - [Utils] SSR/CSR 상태 동기화 및 React Query Hydration 유틸/컴포넌트
 │    │    └── utils/
 │    ├── friend/                   #   [UI Domain: 친구]
 │    │    └── actions/             #      - 친구 관련 Server Actions 
 │    ├── shared/                   #   [Shared UI] 프레젠테이션 계층 전역 공통 요소
 │    │    ├── components/          #      - 재사용 가능한 React 컴포넌트
 │    │    ├── constants/           #      - UI 전용 상수
 │    │    ├── helpers/             #      - UI 헬퍼 함수
 │    │    ├── hooks/               #      - Custom React Hooks
 │    │    ├── icons/               #      - SVG 아이콘 모음
 │    │    ├── types/               #      - UI 전용 타입 정의
 │    │    └── utils/               #      - 유틸리티 함수
 │    ├── strategy/                 #   [UI Domain: 전략]
 │    │    └── actions/             #      - 전략 생성/수정 관련 Server Actions
 │    └── user/                     #   [UI Domain: 사용자]
 │         ├── actions/             #      - 로그인/회원가입 등 Server Actions
 │         └── services/            #      - UI 계층 전용 로직 처리 서비스
 │
 ├── __tests__/                     # [Tests] 계층별 테스트 코드 모음
 │    ├── application/              #   - Use Case 흐름 및 DTO 검증
 │    │    ├── friend/
 │    │    ├── helpers/
 │    │    ├── strategy/
 │    │    └── user/
 │    ├── domain/                   #   - 도메인 모델, VO, 비즈니스 규칙 단위 테스트
 │    │    ├── friend/
 │    │    ├── shared/
 │    │    ├── strategy/
 │    │    └── user/
 │    ├── global/                   #   - DI 컨테이너 매핑 테스트
 │    │    └── di/
 │    └── infrastructure/           #   - 외부 API 연동 통합 테스트
 │         ├── http/
 │         └── user/
 │
 ├── application/                   # [Use Case] 애플리케이션 비즈니스 흐름
 │    ├── constants/                #   - 애플리케이션 계층 전용 상수
 │    ├── friend/
 │    │    ├── dto/                 #      - 계층 간 데이터 전송 객체 
 │    │    └── use-cases/           #      - 친구 추가 등 비즈니스 시나리오
 │    ├── strategy/
 │    │    ├── dto/
 │    │    ├── mappers/             #      - Domain Model <-> DTO 변환기
 │    │    ├── types/
 │    │    └── use-cases/           #      - 전략 조회, 저장 등 비즈니스 시나리오
 │    └── user/
 │         ├── dto/
 │         └── use-cases/
 │
 ├── domain/                        # [Core] 비즈니스 로직
 │    ├── friend/                   #   [Bounded Context: 친구]
 │    │    ├── commands/            #      
 │    │    ├── enum/                #      
 │    │    ├── exceptions/          #      
 │    │    ├── models/              #      
 │    │    ├── port/                #      
 │    │    └── value-objects/       #      
 │    ├── shared/                   #   [Shared Kernel] 컨텍스트 간 공통 도메인 요소
 │    │    ├── exceptions/
 │    │    └── value-objects/
 │    ├── strategy/                 #   [Bounded Context: 전략]
 │    │    ├── commands/            #      
 │    │    ├── constants/           #      
 │    │    ├── enums/               #
 │    │    ├── exceptions/          #
 │    │    ├── models/              #      
 │    │    ├── port/                #
 │    │    └── value-objects/       #
 │    └── user/                     #   [Bounded Context: 사용자]
 │         ├── commands/
 │         ├── enums/
 │         ├── exceptions/
 │         ├── models/
 │         ├── port/
 │         └── value-objects/
 │
 ├── global/                        # [Config] 전역 설정 및 의존성 주입
 │    └── di/                       #   - DI 컨테이너 설정
 │         ├── client/              #   
 │         ├── server/              #   
 │         └── types/               #   
 │
 ├── infrastructure/                # [Adapter] 외부 시스템, API, DB 등의 구체적인 구현체
 │    ├── config/                   #   
 │    │    └── environment-variables/
 │    ├── friend/
 │    │    └── adapter/             #   
 │    ├── http/                     #   
 │    ├── strategy/
 │    │    └── adapter/             #   
 │    └── user/
 │         └── adapter/             #   
 │
 ├── middlewares/                   # [Middleware] Next.js 미들웨어 (인증 처리)
 └── styles/                        # [Assets] 글로벌 스타일 시트 및 CSS 변수
```