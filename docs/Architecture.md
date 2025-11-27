# 아키텍처

1. Clean Architecture vs Hexagonal Architecture(Port & Adapter Architecture)

[기술 스펙]에 따르면, Next.js를 선택하기로 했다.

Clean Architecture는 계층이 4개(Domain, Application, Presentation, Data)로 세분화되어 있어 Next.js의 단순한 서버-클라이언트 구조에는 다소 무겁다.

Hexagonal은 내부(비즈니스 로직)와 외부(어댑터)의 2계층 구조로 더 직관적이다.

Next.js의 RSC(React Server Components)는 서버와 클라이언트 경계가 명확하고, 다양한 외부 시스템(DB, API, 캐시 등)과의 통합이 빈번하다. 

Hexagonal Architecture의 포트-어댑터 패턴이 이런 환경에 더 자연스럽게 맞아 떨어진다.

1. RSC 데이터 패칭의 명확한 구조화(어댑터 교체의 용이성)
    - 헥사고날 강점
        - Hexagonal Architecture는 도메인과 인프라 간의 단일 접점(Port)과 그 구현체(Adapter)를 명시적으로 분리한다.
    - Next.js 적용
        - Next.js는 서버(RSC)와 클라이언트(CSR)에서 다른 데이터 접근 방식이 필요하다.
            - RSC Adapter: `await db.query()`와 같이 서버에서 직접 데이터베이스에 접근하는 어댑터.
            - CSR Adapter: `fetch('/api/...')`와 같이 클라이언트에서 REST API를 호출하는 어댑터.
    - 우위
        - 도메인 로직을 수정하지 않고, 오직 주입되는 Adapter만 교체함으로써, RSC의 서버 성능 이점을 쉽게 활용하고 CSR 환경에도 유연하게 대응할 수 있다.
        - 클린 아키텍처도 가능하지만, Hexagonal의 Ports/Adapters 명칭이 이 교체되는 외부 인프라스트럭처를 표현하는 데 훨씬 직관적이다.

```jsx
// Hexagonal - 간결한 어댑터 교체
// app/products/page.tsx (RSC)
const service = new ProductService(new PrismaProductAdapter());
const products = await service.getAll();

// components/ProductList.tsx (CSR)  
const service = new ProductService(new ApiProductAdapter());
const products = await service.getAll();

// Clean Architecture - 더 많은 계층
// useCase/GetProducts.ts
// presenter/ProductPresenter.ts
// repository/ProductRepository.ts
// 3개 파일 필요
```

2. Use Case 계층의 경량화 및 실용성
    - 클린 아키텍처
        - Domain → Application (← Use Case) → Presentation → Data 4계층 구조를 가진다.
        - Use Case 계층은 비즈니스 규칙의 실행 단위를 별도의 클래스나 함수로 만듭니다.
    - 헥사고날 아키텍처
        - Hexagonal은 Application Service가 Port를 호출하는 단순한 구조라, Clean의 Use Case + Interface Adapter 2계층을 1계층으로 압축할 수 있다
        - Hexagonal Architecture는 이 두 계층을 통합한 Core Domain을 중심으로 설계하므로, 구현에 필요한 파일 수가 줄어들어 더 간결하고 실용적인 구조를 제공할 수 있다.
    

| **공통 장점** | **클린 아키텍처** | **헥사고날 아키텍처** |
| --- | --- | --- |
| **테스트 용이성** | 추상체(Interface, Port)를 Mock으로 대체하여 유스케이스를 테스트할 수 있다. | 구현체(Adapter)를 Mock으로 대체하여 도메인을 테스트할 수 있다. |
| **프레임워크 독립성** | 프레임워크/API/DB 계층을 최외곽에 두어 내부 로직을 보호할 수 있다. | 인프라 구현체(Adpater) 외곽에 두어 핵심 도메인을 보호할 수 있다. |
| **명확한 의존성 경계** | 외부 → 내부로만 의존성을 주입할 수 있도록 방향을 설정한다. | Ports를 중심으로 Adapter가 구현하는 방식으로 의존성 방향을 강제한다. |
