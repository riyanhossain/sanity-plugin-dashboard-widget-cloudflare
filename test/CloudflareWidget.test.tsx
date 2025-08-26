import React from 'react'
import {render, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CloudflareWidget from '../src/CloudflareWidget'
import {WidgetOptions} from '../src/types'
import * as deployModule from '../src/deploy'

// Mock the deploy module
jest.mock('../src/deploy')
const mockHandleDeploy = deployModule.handleDeploy as jest.MockedFunction<typeof deployModule.handleDeploy>

// Mock Sanity UI components
jest.mock('@sanity/dashboard', () => ({
  DashboardWidgetContainer: ({children, header}: {children: React.ReactNode, header: string}) => (
    <div data-testid="dashboard-container">
      <div data-testid="dashboard-header">{header}</div>
      {children}
    </div>
  ),
}))

jest.mock('@sanity/ui', () => ({
  Flex: ({children, as}: {children: React.ReactNode, as?: string}) => (
    <div data-testid={`flex-${as || 'div'}`}>{children}</div>
  ),
  Button: ({onClick, text, disabled, mode, tone, style}: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="deploy-button"
      data-mode={mode}
      data-tone={tone}
      style={style}
    >
      {text}
    </button>
  ),
  Text: ({children, as}: {children: React.ReactNode, as?: string}) => (
    <span data-testid={`text-${as || 'span'}`}>{children}</span>
  ),
  Stack: ({children, as}: {children: React.ReactNode, as?: string}) => (
    <div data-testid={`stack-${as || 'div'}`}>{children}</div>
  ),
  Box: ({children}: {children: React.ReactNode}) => (
    <div data-testid="box">{children}</div>
  ),
}))

describe('CloudflareWidget', () => {
  const mockSites = [
    {
      title: 'Test Site 1',
      url: 'https://example1.com',
      deployHook: 'https://api.cloudflare.com/hook1',
    },
    {
      title: 'Test Site 2',
      url: 'https://example2.com',
      deployHook: 'https://api.cloudflare.com/hook2',
    },
    {
      title: 'Test Site 3 (No Deploy)',
      url: 'https://example3.com',
      deployHook: '',
    },
  ]

  const defaultConfig: WidgetOptions = {
    title: 'My Cloudflare Sites',
    sites: mockSites,
  }

  beforeEach(() => {
    mockHandleDeploy.mockClear()
  })

  describe('Rendering', () => {
    it('renders with default title when no custom title is provided', () => {
      const configWithoutTitle = {...defaultConfig, title: undefined}
      const {getByTestId} = render(<CloudflareWidget {...configWithoutTitle} />)
      
      expect(getByTestId('dashboard-header')).toHaveTextContent('Cloudflare Deploys')
    })

    it('renders with custom title when provided', () => {
      const {getByTestId} = render(<CloudflareWidget {...defaultConfig} />)
      
      expect(getByTestId('dashboard-header')).toHaveTextContent('My Cloudflare Sites')
    })

    it('renders all sites correctly', () => {
      const {getByText} = render(<CloudflareWidget {...defaultConfig} />)
      
      expect(getByText('Test Site 1')).toBeInTheDocument()
      expect(getByText('Test Site 2')).toBeInTheDocument()
      expect(getByText('Test Site 3 (No Deploy)')).toBeInTheDocument()
    })

    it('renders deploy buttons only for sites with deploy hooks', () => {
      const {getAllByTestId} = render(<CloudflareWidget {...defaultConfig} />)
      
      const deployButtons = getAllByTestId('deploy-button')
      expect(deployButtons).toHaveLength(2) // Only 2 sites have deploy hooks
      
      deployButtons.forEach(button => {
        expect(button).toHaveTextContent('Deploy')
      })
    })

    it('does not render deploy button for sites without deploy hooks', () => {
      const configWithNoDeployHook: WidgetOptions = {
        sites: [{
          title: 'No Deploy Site',
          url: 'https://example.com',
          deployHook: '',
        }],
      }
      
      const {queryByTestId} = render(<CloudflareWidget {...configWithNoDeployHook} />)
      
      expect(queryByTestId('deploy-button')).not.toBeInTheDocument()
    })
  })

  describe('Deploy Functionality', () => {
    it('calls handleDeploy when deploy button is clicked', async () => {
      mockHandleDeploy.mockResolvedValue(true)
      const user = userEvent.setup()
      const {getAllByTestId} = render(<CloudflareWidget {...defaultConfig} />)
      
      const deployButtons = getAllByTestId('deploy-button')
      await user.click(deployButtons[0])
      
      expect(mockHandleDeploy).toHaveBeenCalledWith(mockSites[0])
      expect(mockHandleDeploy).toHaveBeenCalledTimes(1)
    })

    it('shows loading state during deployment', async () => {
      let resolvePromise: (value: boolean) => void
      const deployPromise = new Promise<boolean>((resolve) => {
        resolvePromise = resolve
      })
      mockHandleDeploy.mockReturnValue(deployPromise)
      const user = userEvent.setup()
      
      const {getAllByTestId} = render(<CloudflareWidget {...defaultConfig} />)
      
      const deployButtons = getAllByTestId('deploy-button')
      await user.click(deployButtons[0])
      
      // Check loading state
      expect(deployButtons[0]).toHaveTextContent('Deploying…')
      expect(deployButtons[0]).toHaveAttribute('data-tone', 'primary')
      expect(deployButtons[0]).toHaveStyle('cursor: progress')
      expect(deployButtons[0]).toBeDisabled()
      
      // All other buttons should also be disabled during loading
      expect(deployButtons[1]).toBeDisabled()
      
      // Resolve the promise and wrap state update in act
      await act(async () => {
        resolvePromise!(true)
        // Wait for state to update
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(deployButtons[0]).toHaveTextContent('Deploy')
      expect(deployButtons[0]).not.toBeDisabled()
    })

    it('handles deployment failure gracefully', async () => {
      mockHandleDeploy.mockResolvedValue(false)
      const user = userEvent.setup()
      const {getAllByTestId} = render(<CloudflareWidget {...defaultConfig} />)
      
      const deployButtons = getAllByTestId('deploy-button')
      await user.click(deployButtons[0])
      
      // Wait for async operation to complete with act
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(deployButtons[0]).toHaveTextContent('Deploy')
      expect(deployButtons[0]).not.toBeDisabled()
    })
  })

  describe('Edge Cases', () => {
    it('renders correctly with empty sites array', () => {
      const emptyConfig: WidgetOptions = {
        title: 'Empty Sites',
        sites: [],
      }
      
      const {getByTestId, queryByTestId} = render(<CloudflareWidget {...emptyConfig} />)
      
      expect(getByTestId('dashboard-header')).toHaveTextContent('Empty Sites')
      expect(queryByTestId('deploy-button')).not.toBeInTheDocument()
    })

    it('renders correctly with single site', () => {
      const singleSiteConfig: WidgetOptions = {
        sites: [mockSites[0]],
      }
      
      const {getByText, getAllByTestId} = render(<CloudflareWidget {...singleSiteConfig} />)
      
      expect(getByText('Test Site 1')).toBeInTheDocument()
      expect(getAllByTestId('deploy-button')).toHaveLength(1)
    })

    it('handles sites with missing properties gracefully', () => {
      const configWithMissingProps: WidgetOptions = {
        sites: [
          {
            title: '',
            url: '',
            deployHook: 'https://api.cloudflare.com/hook',
          },
        ],
      }
      
      const {getByTestId} = render(<CloudflareWidget {...configWithMissingProps} />)
      
      // Should still render without crashing
      expect(getByTestId('dashboard-container')).toBeInTheDocument()
      expect(getByTestId('deploy-button')).toBeInTheDocument()
    })
  })
})
