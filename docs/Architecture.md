# Architecture Decision

## 설계 원칙: Hexagonal Architecture (Ports & Adapters)

이 프로젝트는 Next.js 환경에서 개발하는 프로젝트입니다.

"유지보수성은 높이되, 개발 속도를 저해하는 불필요한 복잡도는 제거한다"는 것을 핵심 원칙으로 삼았습니다.

이 원칙에 따라 Hexagonal Architecture를 채택했습니다.

그 이유는 다음과 같습니다.

---

### 1. 채택 이유: Next.js Server Actions 와의 결합

아키텍처를 선택한 가장 결정적인 이유는 Next.js의 Server Actions 패턴을 가장 논리적으로 수용할 수 있기 때문입니다.

Next.js 14+ 환경에서는 클라이언트 컴포넌트와 서버 컴포넌트가 공존합니다.<br/>
과거에는 이를 위해 API 라우트를 따로 파거나, 클라이언트용/서버용 로직을 분리해야 했습니다.<br/>
하지만 Server Actions를 Primary Adapter로 정의함으로써 이 문제를 단순화 할 수 있습니다.

**[진입점 통일]**

클라이언트에서 요청하든, 서버에서 초기 데이터를 로드하든, 모든 요청은 Server Action이라는 어댑터를 거쳐 도메인 로직으로 진입합니다. <br/>
덕분에 도메인 로직은 "이 요청이 브라우저에서 왔는지, 서버에서 왔는지" 전혀 신경 쓸 필요가 없습니다.

**[보안 및 캡슐화]:**

구조상 브라우저가 외부 백엔드 API를 직접 호출할 일이 없습니다.<br/>
모든 통신은 Server Action을 통해 서버 간 통신으로 이루어집니다.

따라서 API Key나 민감한 로직이 브라우저에 노출될 위험이 원천적으로 차단됩니다.

**[테스트 용이성]:**

Server Action은 Next.js 의존성이 강해 테스트가 까다롭습니다.<br/>
하지만 비즈니스 로직을 Domain/Application 계층으로 격리해두었기 때문에, Server Action 없이도 순수 TypeScript 환경에서 핵심 로직을 100% 테스트할 수 있습니다.
