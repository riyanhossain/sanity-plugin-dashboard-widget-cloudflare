# Test Suite for Sanity Plugin Dashboard Widget Cloudflare

This test suite provides comprehensive coverage for the Cloudflare dashboard widget plugin.

## Test Files Created

### 1. `test/setupTests.ts`
- Configures Jest environment with global mocks for `fetch` and `alert`
- Sets up `@testing-library/jest-dom` matchers
- Resets all mocks before each test

### 2. `test/CloudflareWidget.test.tsx`
- **Component Rendering Tests**: Verifies proper rendering with and without titles, multiple sites, and edge cases
- **Deploy Functionality Tests**: Tests button clicking, loading states, error handling, and concurrent deployment prevention
- **Edge Cases**: Tests empty sites arrays, single sites, and missing properties

### 3. `test/deploy.test.ts`
- **Network Handling**: Tests POST requests to deploy hooks with correct options
- **Error Scenarios**: Tests missing deploy hooks, network errors, and various response types
- **Success Cases**: Tests successful deployments and opaque responses

### 4. `test/plugin.test.tsx`
- **Widget Configuration**: Tests dashboard widget creation with correct name and layout
- **Error Handling**: Tests rendering when no sites are configured
- **Layout Options**: Tests default and custom layout configurations

## Test Coverage

Current test coverage: **94.82%** statement coverage

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Key Testing Features

1. **Mocked Dependencies**: All external dependencies (Sanity UI, deploy functions) are properly mocked
2. **Async Testing**: Properly handles async operations with user interactions
3. **State Management**: Tests React state updates with proper `act()` wrapping
4. **Edge Cases**: Comprehensive coverage of error scenarios and edge cases
5. **User Interactions**: Tests actual user interactions using `@testing-library/user-event`

## Technologies Used

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **User Event**: Simulating user interactions
- **TypeScript**: Type-safe testing
- **Babel**: JSX transformation for tests
