module.exports = {
    cacheDirectory: './.jest/cache',
    testEnvironment: 'jsdom',
    testMatch: [
      '**/?(*.)+(test|spec).+(ts|tsx|js)',
      '**/__tests__/**/*.+(ts|tsx|js)',
    ],
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.json',
        },
      ]
    },
  }