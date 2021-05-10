module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 8,
    testMatch: ['<rootDir>/tests/**/*.+(ts|tsx|js)'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
    coverageProvider: 'v8',
    collectCoverage: true,
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};
