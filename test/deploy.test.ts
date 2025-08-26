import {handleDeploy} from '../src/deploy'
import {WidgetOptionSite} from '../src/types'

// Mock global fetch and alert
global.fetch = jest.fn()
global.alert = jest.fn()

describe('handleDeploy', () => {
  const mockSite: WidgetOptionSite = {
    title: 'Test Site',
    url: 'https://example.com',
    deployHook: 'https://api.cloudflare.com/hook',
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return false when no deploy hook is provided', async () => {
    const siteWithoutHook: WidgetOptionSite = {
      ...mockSite,
      deployHook: '',
    }

    const result = await handleDeploy(siteWithoutHook)

    expect(result).toBe(false)
    expect(global.alert).toHaveBeenCalledWith('No deploy hook defined for this site.')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should make a POST request with correct options', async () => {
    const mockResponse = {
      ok: true,
      type: 'basic',
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await handleDeploy(mockSite)

    expect(global.fetch).toHaveBeenCalledWith(mockSite.deployHook, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
    })
    expect(result).toBe(true)
    expect(global.alert).toHaveBeenCalledWith('Deployment triggered successfully!')
  })

  it('should handle successful opaque response', async () => {
    const mockResponse = {
      ok: false,
      type: 'opaque',
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await handleDeploy(mockSite)

    expect(result).toBe(true)
    expect(global.alert).toHaveBeenCalledWith('Deployment triggered successfully!')
  })

  it('should handle failed non-opaque response', async () => {
    const mockResponse = {
      ok: false,
      type: 'basic',
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await handleDeploy(mockSite)

    expect(result).toBe(false)
    expect(global.alert).toHaveBeenCalledWith('Error triggering deployment')
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const result = await handleDeploy(mockSite)

    expect(result).toBe(false)
    expect(global.alert).toHaveBeenCalledWith('Error triggering deployment')
  })

  it('should handle fetch throwing an exception', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await handleDeploy(mockSite)

    expect(result).toBe(false)
    expect(global.alert).toHaveBeenCalledWith('Error triggering deployment')
  })
})
