# 디자인 패턴

## 방법론

### 도메인 주도 설계(Domain Driven Development)

- 소프트웨어를 **비즈니스 도메인 중심**으로 설계
- 핵심: **도메인 전문가와 개발자의 협업**, 언어와 모델의 일치
- 핵심 구성 요소:

| **구성 요소** | **설명** |
| --- | --- |
| Entity | 고유 식별자를 가진 객체, 생명주기 있음 |
| Value Object | 불변 객체, 동등성 비교로 관리 |
| Aggregate | 관련 Entity/VO를 묶어 일관성 경계 설정 |
| Repository | Aggregate 저장/조회 추상화 |
| Service | 도메인 로직이 개별 Entity에 속하지 않을 때 사용 |
| Domain Event | 도메인 내 사건, 다른 로직에 통보 가능 |

### 테스트 주도 설계(Test Driven Development)

- 개발자가 기능을 먼저 테스트 코드로 정의
- 테스트 실패 → 실제 코드 작성 → 테스트 통과 → 리팩토링 반복

---

### **DDD와 TDD를 결합한 개발 프로세스 예시 (Hexagonal 기반)**

1. **도메인 분석**
    - 핵심 비즈니스 규칙, Aggregate 식별
2. **TDD 기반 도메인 구현**
    - Aggregate 단위로 테스트 작성 → 실패 → 도메인 로직 구현 → 테스트 통과
3. **Hexagonal 포트 정의**
    - Repository, 외부 API 등의 인터페이스 정의
4. **Adapter 구현**
    - 실제 DB, 메시지 큐, 외부 API 연결
5. **통합 테스트**
    - Hexagonal Architecture 전체 흐름 검증

두 설계 방법론은 상호보완적으로, DDD → 도메인 모델을 체계적으로 설계 / TDD → 설계한 도메인을 검증하며 구현 같이 채택했을 때 좋은 시너지가 발생할 수 있다.

# 기술

## 의존성 주입 패턴

### Dependency Injection (with Inversify)

Factory Pattern을 사용하여 DI를 수동으로 구현할 수 있지만, 직접 구현해봤을 때 관리가 불편함.

Inversify는 써보지 않았는데 IoC Container를 제공해주는 라이브러리가 있다고 해서 사용해봄직해보여 결정 하였음.

InversifyJS는 NodeJS 기반의 어플리케이션 위에서 동작하는 IoC Container이고 생성자 주입으로 객체간의 의존관계를 설정하는 방법을 제공하며, InversifyJS에서는 런타임 오버헤드를 최대한 줄이면서 JS 개발 생태계에서 SOLID 원칙을 준수하여 어플리케이션을 개발할 수 있도록 도와준다고 함. 

궁극적으로는 DX(Development Experience)를 높여주는 데 의의를 두고 있는데, 이는 수동으로 DI를 구현해본 입장에서 DI를 위해 여러 코드 관리의 불편함을 겪어보아 심히 공감됨.

## 데이터(외부세계) 계층 접근 패턴

### Repository Pattern

Hexagonal의 Secondary Port를 구현하는 표준 방법.

Hexagonal Architecture에서 Port는 다음과 같이 구현됨.

- Primary Port (Driving Port): 애플리케이션을 사용하는 인터페이스 (입력)
- Secondary Port (Driven Port): 애플리케이션이 사용하는 인터페이스 (출력)

Secondary Port는 도메인이 외부 세계에 요청하는 것으로 Repository Pattern의 개념과 일치 (DIP)

→ 데이터 영속성, 외부 API, 메시징 등

```tsx
// Secondary Port (도메인이 정의하는 인터페이스)
interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
}

// Secondary Adapter (인프라가 구현)
class PrismaProductRepository implements ProductRepository {
  async save(product: Product) {
    await prisma.product.create({ data: product });
  }
}

...

// 1. Repository (데이터 영속성)
interface UserRepository extends SecondaryPort {
  findByEmail(email: string): Promise<User>;
}

// 2. Email Service (외부 API)
interface EmailService extends SecondaryPort {
  sendWelcomeEmail(to: string): Promise<void>;
}

// 3. Payment Gateway (외부 시스템)
interface PaymentGateway extends SecondaryPort {
  charge(amount: number, token: string): Promise<TransactionId>;
}

// 4. Cache (인프라)
interface CachePort extends SecondaryPort {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}
```

## 비즈니스 로직 패턴

### **Application Service Pattern**

클린 아키텍처의 Use Case와 동일.

도메인 로직을 조율(orchestrate)하고, 트랜잭션, 권한 검증, 여러 Repository 조합 등을 진행함.

```tsx
// domain/entities/user.entity.ts
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    private password: string
  ) {}

  static create(email: string, password: string): User {
    // 핵심 비즈니스 규칙: 이메일 검증
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
    // 비밀번호 해싱은 여기서
    const hashedPassword = bcrypt.hashSync(password, 10);
    return new User(uuid(), email, hashedPassword);
  }

  verifyPassword(plain: string): boolean {
    return bcrypt.compareSync(plain, this.password);
  }
}

// application/ports/user.repository.ts (Secondary Port)
export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

// application/ports/email.service.ts (Secondary Port)
export interface EmailService {
  sendWelcomeEmail(to: string): Promise<void>;
}
```

```tsx
// application/use-cases/register-user.usecase.ts
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,    // Secondary Port
    private readonly emailService: EmailService         // Secondary Port
  ) {}

  async execute(dto: RegisterUserDTO): Promise<RegisterUserResult> {
    // 1. 중복 검증 (애플리케이션 규칙)
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 2. 도메인 엔티티 생성 (도메인 규칙은 Entity가 담당)
    const user = User.create(dto.email, dto.password);

    // 3. 영속화 (트랜잭션 시작)
    await this.userRepository.save(user);

    // 4. 외부 서비스 호출
    await this.emailService.sendWelcomeEmail(user.email);

    // 5. 결과 반환
    return {
      userId: user.id,
      email: user.email
    };
  }
}
```

```tsx
// app/actions/auth.actions.ts
'use server'

export async function registerAction(formData: FormData) {
  // 1. DTO 생성 및 검증
  const dto = RegisterUserSchema.parse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  // 2. Use Case 의존성 주입
  const userRepository = container.get<UserRepository>('UserRepository');
  const emailService = container.get<EmailService>('EmailService');
  const useCase = new RegisterUserUseCase(userRepository, emailService);

  // 3. Use Case 실행
  try {
    const result = await useCase.execute(dto);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

```tsx
// __tests__/register-user.usecase.spec.ts
describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    // Mock Secondary Ports
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn()
    };
    mockEmailService = {
      sendWelcomeEmail: jest.fn()
    };
    
    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockEmailService
    );
  });

  it('should register new user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.userId).toBeDefined();
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw error if user exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      User.create('test@example.com', 'pass')
    );

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'pass' })
    ).rejects.toThrow('User already exists');
  });
});
```

## 입력/출력 패턴

### **Server Actions Pattern**

Server Actions는 Next.js 13.4+에서 도입된 기능.

Server Actions이란?

1. 서버에서만 실행되는 비동기 함수
2. 클라이언트에서 직접 호출 가능하지만 코드는 서버에서만 실행
3. `'use server'` 지시어로 표시
4. Hexagonal에서는 Primary Adapter 역할

```tsx
// app/actions/product.actions.ts
'use server'

export async function createProduct(formData: FormData) {
  // 이 코드는 서버에서만 실행됨
  const name = formData.get('name');
  await db.product.create({ data: { name } });
}
```

전통적인 방식 vs Server Actions

```tsx
// app/api/products/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const product = await db.product.create({ data: body });
  return Response.json(product);
}

// components/ProductForm.tsx
'use client'
export function ProductForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const product = await res.json();
  };
}
```

문제점:

- API 엔드포인트 생성 필요
- fetch 코드 작성 필요
- 직렬화/역직렬화 오버헤드
- 타입 안정성 부족 (클라이언트-서버 경계)

```tsx
// app/actions/product.actions.ts
'use server'

export async function createProduct(formData: FormData) {
  const product = await db.product.create({
    data: { name: formData.get('name') as string }
  });
  return product;
}

// components/ProductForm.tsx
'use client'
import { createProduct } from '@/app/actions/product.actions';

export function ProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

Server Actions의 3가지 패턴.

```tsx
// app/actions/auth.actions.ts
'use server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // 검증
  const validated = LoginSchema.parse({ email, password });
  
  // Use Case 실행
  const userRepo = container.get<UserRepository>('UserRepository');
  const useCase = new LoginUserUseCase(userRepo);
  const result = await useCase.execute(validated);
  
  // 세션 설정
  await setSession(result.token);
  redirect('/dashboard');
}

// app/login/page.tsx
export default function LoginPage() {
  return (
    <form action={loginAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

**특징:**

- HTML Form과 완벽 통합
- JS 비활성화 상태에서도 작동 (Progressive Enhancement)
- `redirect()`, `revalidatePath()` 사용 가능

```tsx
// app/actions/product.actions.ts
'use server'

export async function deleteProduct(productId: string) {
  const repo = container.get<ProductRepository>('ProductRepository');
  await repo.delete(productId);
  revalidatePath('/products');
  return { success: true };
}

// components/ProductCard.tsx
'use client'
import { deleteProduct } from '@/app/actions/product.actions';

export function ProductCard({ id }: Props) {
  const handleDelete = async () => {
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success('Deleted!');
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}
```

특징:

- 이벤트 핸들러에서 직접 호출
- 비동기 함수처럼 사용
- `useTransition`으로 로딩 상태 관리 가능

```tsx
// app/actions/product.actions.ts
'use server'

export async function createProductAction(
  prevState: any,
  formData: FormData
) {
  try {
    const dto = CreateProductSchema.parse({
      name: formData.get('name'),
      price: Number(formData.get('price'))
    });

    const repo = container.get<ProductRepository>('ProductRepository');
    const useCase = new CreateProductUseCase(repo);
    await useCase.execute(dto);

    return { success: true, message: 'Product created!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// components/ProductForm.tsx
'use client'
import { useFormState, useFormStatus } from 'react-dom';
import { createProductAction } from '@/app/actions/product.actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Creating...' : 'Create'}
    </button>
  );
}

export function ProductForm() {
  const [state, formAction] = useFormState(createProductAction, null);

  return (
    <form action={formAction}>
      <input name="name" />
      <input name="price" type="number" />
      <SubmitButton />
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

특징:

- 폼 상태 관리 자동화
- 로딩/에러 상태 쉽게 처리
- Optimistic UI 구현 가능

---

✅ useFormState/useFormStatus/useOptimistic (React 19) 패턴으로 사용.

- 실전 패턴 예시 (Server Actions + Hexagonal)
    
    ```tsx
    // factories/action.factory.ts
    export function createProductActions() {
      const repository = container.get<ProductRepository>('ProductRepository');
      
      return {
        async create(formData: FormData) {
          'use server'
          const dto = CreateProductSchema.parse({
            name: formData.get('name')
          });
          
          const useCase = new CreateProductUseCase(repository);
          return useCase.execute(dto);
        },
        
        async delete(id: string) {
          'use server'
          const useCase = new DeleteProductUseCase(repository);
          await useCase.execute(id);
          revalidatePath('/products');
        }
      };
    }
    
    // app/products/page.tsx
    const actions = createProductActions();
    
    export default function ProductsPage() {
      return <ProductForm createAction={actions.create} />;
    }// factories/action.factory.ts
    export function createProductActions() {
      const repository = container.get<ProductRepository>('ProductRepository');
      
      return {
        async create(formData: FormData) {
          'use server'
          const dto = CreateProductSchema.parse({
            name: formData.get('name')
          });
          
          const useCase = new CreateProductUseCase(repository);
          return useCase.execute(dto);
        },
        
        async delete(id: string) {
          'use server'
          const useCase = new DeleteProductUseCase(repository);
          await useCase.execute(id);
          revalidatePath('/products');
        }
      };
    }
    
    // app/products/page.tsx
    const actions = createProductActions();
    
    export default function ProductsPage() {
      return <ProductForm createAction={actions.create} />;
    }
    ```
    
    ```tsx
    // lib/action-validator.ts
    export function withValidation<T>(
      schema: z.Schema<T>,
      handler: (data: T) => Promise<any>
    ) {
      return async (formData: FormData) => {
        'use server'
        try {
          const data = Object.fromEntries(formData);
          const validated = schema.parse(data);
          return await handler(validated);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return { errors: error.flatten() };
          }
          throw error;
        }
      };
    }
    
    // app/actions/product.actions.ts
    export const createProduct = withValidation(
      CreateProductSchema,
      async (data) => {
        const repo = container.get<ProductRepository>('ProductRepository');
        const useCase = new CreateProductUseCase(repo);
        return useCase.execute(data);
      }
    );
    ```
    

## 데이터 검증 패턴

### DTO + Validation Pattern (Zod 라이브러리 사용)

DTO (Data Transfer Object) + Validation Pattern은 TypeScript/JavaScript 애플리케이션에서 데이터의 구조와 유효성을 안전하게 검증하는 패턴. 

Zod는 이를 구현하는 강력한 스키마 검증 라이브러리.

- 사용 예시
    
    ```tsx
    const EnvSchema = z.object({
      NODE_ENV: z.enum(['development', 'production', 'test']),
      DATABASE_URL: z.string().url(),
      PORT: z.string().transform(Number),
      JWT_SECRET: z.string().min(32)
    });
    
    const env = EnvSchema.parse(process.env);
    // 앱 시작 시 환경변수 검증!
    ```
    
    ```tsx
    const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type) {
        return { message: `${issue.path}는 ${issue.expected} 타입이어야 합니다` };
      }
      return { message: ctx.defaultError };
    };
    
    z.setErrorMap(customErrorMap);
    ```
    
    ```tsx
    // 민감한 정보 제외한 응답 DTO
    const UserResponseDto = z.object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      role: z.string(),
      createdAt: z.date().transform(date => date.toISOString())
      // password는 의도적으로 제외
    });
    
    type UserResponseDto = z.infer<typeof UserResponseDto>;
    
    // 사용 예시
    function getUserById(id: number): UserResponseDto {
      const user = database.findUser(id); // 모든 필드 포함
      
      // 응답 DTO로 파싱 (민감정보 자동 제거)
      return UserResponseDto.parse({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      });
    }
    ```
    
    ```tsx
    const AddressSchema = z.object({
      street: z.string(),
      city: z.string(),
      zipCode: z.string().regex(/^\d{5}$/)
    });
    
    const OrderItemSchema = z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.number().positive()
    });
    
    const CreateOrderDto = z.object({
      userId: z.number(),
      items: z.array(OrderItemSchema).min(1, '최소 1개 상품 필요'),
      shippingAddress: AddressSchema,
      billingAddress: AddressSchema.optional(),
      paymentMethod: z.enum(['card', 'bank', 'cash']),
      totalAmount: z.number().positive()
    }).refine(
      (data) => {
        // 커스텀 검증: 총액이 아이템 합계와 일치하는지
        const itemsTotal = data.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        return Math.abs(itemsTotal - data.totalAmount) < 0.01;
      },
      { message: '총액이 아이템 합계와 일치하지 않습니다' }
    );
    
    type CreateOrderDto = z.infer<typeof CreateOrderDto>;
    ```
    
    ```tsx
    import { z } from 'zod';
    import { Request, Response, NextFunction } from 'express';
    
    // DTO 스키마 정의
    const CreateUserDto = z.object({
      email: z.string().email('유효한 이메일을 입력하세요'),
      password: z.string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
        .regex(/[A-Z]/, '대문자를 포함해야 합니다')
        .regex(/[0-9]/, '숫자를 포함해야 합니다'),
      name: z.string().min(2).max(50),
      phoneNumber: z.string().regex(/^010-\d{4}-\d{4}$/).optional()
    });
    
    type CreateUserDto = z.infer<typeof CreateUserDto>;
    
    // 검증 미들웨어
    const validateDto = (schema: z.ZodSchema) => {
      return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
          return res.status(400).json({
            error: '입력 데이터 검증 실패',
            details: result.error.format()
          });
        }
        
        req.body = result.data; // 검증된 데이터로 교체
        next();
      };
    };
    
    // 라우터에서 사용
    app.post('/users', 
      validateDto(CreateUserDto), 
      (req: Request, res: Response) => {
        const userData: CreateUserDto = req.body;
        // 이제 userData는 완전히 검증되고 타입이 안전함
        // ...
      }
    );
    
    ```
    
    주의사항
    
    1. **성능**: 복잡한 스키마는 검증 비용 발생
        
        ```tsx
        // 자주 호출되는 곳에서는 parse 대신 미리 컴파일
        const validator = UserSchema.safeParse;
        ```
        
    2. **순환 참조**: `z.lazy()` 사용
        
        ```tsx
        interface Category {
          name: string;
          subcategories: Category[];
        }
        
        const CategorySchema: z.ZodType<Category> = z.lazy(() =>
          z.object({
            name: z.string(),
            subcategories: z.array(CategorySchema)
          })
        );
        ```
        
    3. **Date 객체**: JSON에서 문자열로 전송됨
        
        ```tsx
        const DateSchema = z.string()
          .datetime()
          .transform(str => new Date(str));
        ```