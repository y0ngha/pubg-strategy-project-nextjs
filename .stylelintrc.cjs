// .stylelintrc.js
module.exports = {
    // 1. extends 간소화 및 최신 패키지 사용
    extends: [
        // 표준 CSS + SCSS 권장 규칙을 포함한 통합 패키지 (가장 권장됨)
        'stylelint-config-standard-scss',

        // 속성 순서 자동 정렬 (recess order)
        'stylelint-config-recess-order',
    ],

    plugins: [
        // stylelint-order는 recess-order 설정을 위해 필요
        'stylelint-order',
    ],

    rules: {
        // 2. SCSS와 Tailwind 사용 시 가장 중요한 설정 (기본 규칙 끄고 SCSS 규칙 켜기)
        // stylelint-config-standard-scss가 내부적으로 'at-rule-no-unknown': null을 해주지만,
        // 명시적으로 Tailwind 문법을 허용하기 위해 아래 설정이 필수입니다.
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'tailwind',
                    'apply',
                    'variants',
                    'screen',
                    'layer',
                    'theme',
                    'config', // Tailwind 설정 관련
                ],
            },
        ],

        // 3. Next.js CSS Modules 사용 시 클래스 명명 규칙 완화
        // 기본값은 kebab-case이나, CSS Modules에서는 styles.myClass 처럼 camelCase를 많이 씀
        'selector-class-pattern': null,
        // 혹은 엄격하게 하려면 정규식 사용: '^[a-z][a-zA-Z0-9]+$' (camelCase 강제)

        // 4. SCSS 문법 관련 추가 설정
        // 중첩 선택자 사용 시 불필요한 & 제거 강제
        'scss/selector-no-redundant-nesting-selector': true,

        // 5. Tailwind의 @screen 등을 사용할 때 미디어 쿼리 이름 오류 방지
        'media-feature-name-no-unknown': [
            true,
            { ignoreMediaFeatureNames: ['screen'] },
        ],

        // 6. Prettier와의 충돌 방지를 위해 빈 줄 관련 규칙 등은 Stylelint에서 제거됨 (설정 불필요)
        // 단, CSS 가독성을 위해 블록 닫는 괄호 뒤 빈 줄 강제는 유지할 수 있음 (선택 사항)
        'rule-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['after-comment'],
            },
        ],

        // CSS Modules의 :global, :local 가상 선택자 허용
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global', 'local'],
            },
        ],
    },

    // 불필요한 파일 무시
    ignoreFiles: [
        '**/*.js',
        '**/*.ts',
        '**/*.jsx',
        '**/*.tsx',
        '**/*.json',
        '**/*.md',
        '**/.next/**', // Next.js 빌드 결과물
        '**/dist/**',
        '**/node_modules/**',
    ],
};
