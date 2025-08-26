import {WidgetOptionSite} from './types'

// Triggers a deploy hook. Returns true on (assumed) success, false on failure.
export const handleDeploy = async (site: WidgetOptionSite): Promise<boolean> => {
  if (!site.deployHook) {
    alert('No deploy hook defined for this site.')
    return false
  }

  try {
    const response = await fetch(site.deployHook, {
      method: 'POST',
      mode: 'no-cors', // no-cors means we usually can't inspect the real response
      cache: 'no-cache',
    })

    // In no-cors mode, response.ok is false for opaque responses; treat as success if no exception
    if (!response.ok && response.type !== 'opaque') {
      throw new Error('Failed to trigger deployment')
    }

    alert('Deployment triggered successfully!')
    return true
  } catch (error) {
    alert('Error triggering deployment')
    return false
  }
}
