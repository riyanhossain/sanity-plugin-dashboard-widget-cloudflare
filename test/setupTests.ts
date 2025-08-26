import '@testing-library/jest-dom'

// Mock global fetch for tests
global.fetch = jest.fn()

// Mock global alert for tests
global.alert = jest.fn()

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks()
})
