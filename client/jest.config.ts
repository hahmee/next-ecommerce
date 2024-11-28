import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jest-fixed-jsdom',
    // testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: [""],
    },
    moduleDirectories: ['node_modules', 'src'],
    modulePaths: ['<rootDir>/app/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // @ 경로를 src 디렉토리로 매핑
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // TypeScript 파일을 트랜스파일
        '^.+\\.js$': 'babel-jest', // ESM 형식의 JS 파일 트랜스파일
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(react-dnd|dnd-core|@react-dnd)/)', // 변환할 ESM 패키지
    ],
    roots: ['<rootDir>'],
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    preset: 'ts-jest',
    testMatch: ['**/*.test.tsx'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.jest.json',
        },
    },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)