/**
 * Jest 실행 시 환경변수를 주입합니다.
 */

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
process.env.NEXT_BACKEND_API_URL = 'http://localhost:8080';
process.env.AES256_SECRET_KEY = '12345678901234567890123456789012';
process.env.GOOGLE_CLIENT_ID = 'your-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'your-google-client-secret';
process.env.GOOGLE_REDIRECT_URI =
    'http://localhost:4200/api/auth/callback/google';
