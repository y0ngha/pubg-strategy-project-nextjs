module.exports = {
    cacheDirectory: './.jest/cache',
    testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/app/__tests__/infrastructure/http/api-client.setup.ts',
    ],
    testMatch: ['**/__tests__/**/*.+(test|spec).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(t|j)sx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    // MSW를 위한 무시 처리
    transformIgnorePatterns: ['node_modules/(?!(msw|@msw|until-async)/)'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
        '^@infrastructure/(.*)$': '<rootDir>/app/infrastructure/$1',
        '^@global/(.*)$': '<rootDir>/app/global/$1',
    },
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
};
