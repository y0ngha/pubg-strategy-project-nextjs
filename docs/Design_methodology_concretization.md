# 설계 방법론 구체화

# **설계 원칙: Hexagonal + DDD + TDD**

1. **도메인 중심 원칙**
    - 애플리케이션의 핵심은 **도메인 로직**.
    - 외부 의존성(DB, UI, API 등)에 종속되지 않아야 함.
    - 핵심 도메인은 **변화에 강하고 테스트 가능**해야 함.
2. **계층 분리 원칙**
    - **Domain (도메인 계층)**
        - Entity, Value Object, Aggregate, Domain Service, Domain Event 포함
        - 순수 비즈니스 규칙만 존재
    - **Application (애플리케이션 계층)**
        - Use Case / Service 정의
        - 도메인을 호출하고 외부 포트를 통해 입출력 처리
    - **Adapter / Infrastructure (인프라 계층)**
        - DB, 메시지, 외부 API 구현
        - Repository, Gateway 등 외부 의존성 구현
    - **Ports (포트 계층)**
        - 인터페이스 정의, 도메인과 외부 시스템 연결점
3. **TDD 원칙**
    - 테스트 코드 먼저 작성 → 실패 확인 → 실제 코드 작성 → 테스트 통과 → 리팩토링
    - 핵심 도메인 단위로 테스트
    - 외부 의존성은 Mocking/Stub 처리
4. **DDD 원칙**
    - 바운디드 컨텍스트(Bounded Context) 정의
    - 유비쿼터스 언어(Ubiquitous Language) 사용
    - Aggregate 단위로 일관성 유지
    - 리포지토리 통해 Aggregate 조회/저장
    - 도메인 이벤트로 상태 변화 통지

### **Best Practices**

1. **의존성 역전**
    - Domain → Port → Adapter
    - 도메인이 외부에 의존하지 않도록 Port/Adapter 사용
2. **단일 책임 원칙**
    - Aggregate는 하나의 비즈니스 일관성 책임만
    - Application Service는 도메인 호출 orchestration만
3. **불변성**
    - Value Object, Domain Event는 불변
4. **테스트 용이성**
    - 외부 의존성 Mock
    - Domain, Application 계층은 테스트 독립성 확보
5. **유비쿼터스 언어**
    - 코드와 도메인 용어 일치
    - 커뮤니케이션 오류 최소화
6. **도메인 이벤트 활용**
    - 시스템 내 상태 변화 전파
    - 비동기 연계 시 유용
7. **TDD 적용**
    - Red → Green → Refactor 주기 철저히
    - 테스트 커버리지 100% 목표 아님, 핵심 도메인 중심

---

# **구체적 설계/분리 방법**

| **계층** | **역할** | **포함 요소** | **설계 포인트** |
| --- | --- | --- | --- |
| **Domain** | 핵심 비즈니스 규칙 | Entity, Value Object, Aggregate, Domain Service, Domain Event | - 외부 의존성 없음
- 상태와 규칙 중심 설계
- 불변성과 캡슐화 |
| **Application** | Use Case Orchestration | Application Service, Port Interface | - 도메인을 호출
- 입출력 변환 책임
- 비즈니스 규칙 포함 최소화 |
| **Port** | 외부 시스템 인터페이스 | Repository, Gateway Interface | - 외부 의존성 추상화
- 도메인과 기술 결합 최소화 |
| **Adapter / Infrastructure** | 실제 외부 시스템 구현 | DB Repository, API Client, Message Publisher | - Port 구현
- 기술 변화 시 도메인 영향 없음 |
- 도메인 → 포트 → 어댑터 방향으로 의존성 흐름
- Application 계층은 도메인 호출 조정만
- Infrastructure는 테스트 가능하도록 Mock/Stub 사용

---

# **설계 과정 (단계별)**

### **1. 도메인 분석**

- 핵심 Entity, Aggregate 정의
- Value Object와 Entity 구분
- 바운디드 컨텍스트 설정
- 도메인 이벤트(Event) 식별

### **2. 포트 정의**

- Repository, Service 인터페이스 정의
- 도메인이 외부 시스템을 직접 호출하지 않도록 추상화
- 예: OrderRepository, PaymentGateway

### **3. Application Service 설계**

- 유스케이스별 서비스 작성
- 입출력 DTO 정의, 변환 책임
- 도메인 호출 순서 정의

### **4. Adapter/Infra 구현**

- DB, API, Messaging 등 구현
- 포트 인터페이스 구현
- 실제 외부 기술과 연결

### **5. TDD 적용**

- **도메인 중심 테스트** 작성 (Entity, Aggregate 단위)
- Application Service 테스트 → Mock Port 사용
- Adapter 테스트 → 실제 시스템 연결 또는 Integration Test

### **6. 리팩토링**

- 테스트 통과 후 중복 제거, 구조 개선
- 기술 변경 시 도메인 영향 최소화

---

# **전체 폴더 구조 예시**

```
src/
 └── main/
      ├── kotlin/
      │    └── com/example/project/
      │         ├── domain/               # 핵심 비즈니스 로직
      │         │    ├── model/          # Entity, Value Object
      │         │    │    ├── Order.ts
      │         │    │    └── Money.ts
      │         │    ├── service/        # Domain Service
      │         │    │    └── OrderDomainService.ts
      │         │    ├── repository/     # Port 인터페이스
      │         │    │    └── OrderRepository.ts
      │         │    └── event/          # Domain Event
      │         │         └── OrderPlacedEvent.ts
      │         │
      │         ├── application/         # Use Case Orchestration
      │         │    ├── service/
      │         │    │    └── OrderApplicationService.ts
      │         │    └── dto/            # 입출력 DTO
      │         │         ├── CreateOrderRequest.ts
      │         │         └── OrderResponse.ts
      │         │
      │         ├── adapter/             # Adapter / Infrastructure 구현
      │         │    ├── persistence/    # DB, Repository 구현
      │         │    │    └── OrderRepositoryImpl.ts
      │         │    ├── messaging/      # Event/Message Publisher
      │         │    │    └── OrderEventPublisher.ts
      │         │    └── api/            # 외부 API 호출
      │         │         └── PaymentGatewayClient.ts
      │         │
      │         └── presentation/        # 사용자 입력 처리
      │              └── rest/
      │                   └── OrderController.ts
      │
      └── resources/
           └── application.yml           # 설정

 └── test/
      └── kotlin/
           └── com/example/project/
                ├── domain/
                │    └── model/
                │         └── OrderTest.ts       # Entity/VO 단위 테스트
                ├── application/
                │    └── service/
                │         └── OrderApplicationServiceTest.ts  # Use Case 테스트
                └── adapter/
                     └── persistence/
                          └── OrderRepositoryImplTest.ts       # Adapter/Infra 테스트
```

---

## **계층별 역할과 설계 포인트**

| **계층** | **폴더** | **역할** | **설계 포인트** |
| --- | --- | --- | --- |
| **Domain** | domain | 핵심 비즈니스 규칙 | - 외부 의존성 없음
- Aggregate 단위로 일관성 유지
- 불변성 & 캡슐화 |
| **Application** | application/service | Use Case orchestration | - 도메인 호출만 수행
- 외부 포트(Mock) 통해 테스트 가능
- DTO로 입출력 변환 |
| **Adapter/Infra** | adapter | DB, Messaging, 외부 API 구현 | - Port 구현
- 기술 변화 시 도메인 영향 최소화
- Integration Test 수행 |
| **Presentation** | presentation | REST/CLI/WebSocket 요청 처리 | - 검증, DTO 변환
- 도메인 로직 포함 금지 |
| **Test** | test | TDD 기반 단위/통합 테스트 | - Domain 테스트: Aggregate/Entity 단위- Application 테스트: Use Case orchestration + Port Mock- Adapter 테스트: DB/API 연결 |

---

# **TDD 적용 포인트**

1. **Domain 계층**
    - Aggregate 단위 테스트
    - Entity/Value Object 불변성 검증
    - 도메인 규칙 검증
2. **Application 계층**
    - Use Case 단위 테스트
    - Port Mocking으로 외부 의존성 제거
    - 요청-응답 DTO 검증
3. **Adapter/Infrastructure 계층**
    - Integration Test
    - DB, 메시지, API 실제 연결 검증
    - 기술 의존성 변화 시 테스트 안전성 확보

---