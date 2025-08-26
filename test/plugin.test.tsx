import React from 'react'
import {render} from '@testing-library/react'
import {cloudflareWidget, CloudflareWidgetConfig} from '../src/plugin'

// Mock the CloudflareWidget component
jest.mock('../src/CloudflareWidget', () => {
  return function MockCloudflareWidget(props: any) {
    return (
      <div data-testid="cloudflare-widget">
        <div data-testid="widget-title">{props.title}</div>
        <div data-testid="widget-sites-count">{props.sites.length}</div>
      </div>
    )
  }
})

// Mock Sanity UI components
jest.mock('@sanity/ui', () => ({
  Card: ({children, tone, padding}: {children: React.ReactNode, tone?: string, padding?: number}) => (
    <div data-testid="card" data-tone={tone} data-padding={padding}>
      {children}
    </div>
  ),
  Text: ({children}: {children: React.ReactNode}) => (
    <span data-testid="text">{children}</span>
  ),
}))

describe('cloudflareWidget', () => {
  const mockSites = [
    {
      title: 'Site 1',
      url: 'https://example1.com',
      deployHook: 'https://api.cloudflare.com/hook1',
    },
    {
      title: 'Site 2',
      url: 'https://example2.com',
      deployHook: 'https://api.cloudflare.com/hook2',
    },
  ]

  const defaultConfig: CloudflareWidgetConfig = {
    title: 'Test Widget',
    sites: mockSites,
  }

  it('should return a dashboard widget with correct name', () => {
    const widget = cloudflareWidget(defaultConfig)
    
    expect(widget.name).toBe('cloudflare-widget')
    expect(widget.component).toBeDefined()
    expect(widget.layout).toBeDefined()
  })

  it('should use default layout when none is provided', () => {
    const widget = cloudflareWidget(defaultConfig)
    
    expect(widget.layout).toEqual({width: 'medium'})
  })

  it('should use custom layout when provided', () => {
    const customLayout = {width: 'large' as const}
    const configWithLayout: CloudflareWidgetConfig = {
      ...defaultConfig,
      layout: customLayout,
    }
    
    const widget = cloudflareWidget(configWithLayout)
    
    expect(widget.layout).toEqual(customLayout)
  })

  it('should render CloudflareWidget when sites are provided', () => {
    const widget = cloudflareWidget(defaultConfig)
    const Component = widget.component
    
    const {getByTestId} = render(<Component />)
    
    expect(getByTestId('cloudflare-widget')).toBeInTheDocument()
    expect(getByTestId('widget-title')).toHaveTextContent('Test Widget')
    expect(getByTestId('widget-sites-count')).toHaveTextContent('2')
  })

  it('should render error card when no sites are provided', () => {
    const configWithoutSites: CloudflareWidgetConfig = {
      title: 'Empty Widget',
      sites: [],
    }
    
    const widget = cloudflareWidget(configWithoutSites)
    const Component = widget.component
    
    const {getByTestId} = render(<Component />)
    
    expect(getByTestId('card')).toBeInTheDocument()
    expect(getByTestId('card')).toHaveAttribute('data-tone', 'critical')
    expect(getByTestId('text')).toHaveTextContent(
      'No sites are defined in the widget options. Please check your config.'
    )
  })

  it('should render error card when sites property is undefined', () => {
    const configWithoutSites = {
      title: 'Empty Widget',
      // sites property is omitted
    } as CloudflareWidgetConfig
    
    const widget = cloudflareWidget(configWithoutSites)
    const Component = widget.component
    
    const {getByTestId} = render(<Component />)
    
    expect(getByTestId('card')).toBeInTheDocument()
    expect(getByTestId('card')).toHaveAttribute('data-tone', 'critical')
    expect(getByTestId('text')).toHaveTextContent(
      'No sites are defined in the widget options. Please check your config.'
    )
  })

  it('should handle empty title gracefully', () => {
    const configWithoutTitle: CloudflareWidgetConfig = {
      sites: mockSites,
      // title is omitted
    }
    
    const widget = cloudflareWidget(configWithoutTitle)
    const Component = widget.component
    
    const {getByTestId} = render(<Component />)
    
    expect(getByTestId('cloudflare-widget')).toBeInTheDocument()
    expect(getByTestId('widget-sites-count')).toHaveTextContent('2')
  })
})
