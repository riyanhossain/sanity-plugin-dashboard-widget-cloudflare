import {WidgetOptionSite} from './types'

export const handleDeploy = async (site: WidgetOptionSite) => {
  if (!site.deployHook) {
    alert('No deploy hook defined for this site.')
    return
  }

  try {
    const response = await fetch(site.deployHook, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error('Failed to trigger deployment')
    }
    
    alert('Deployment triggered successfully!')
  } catch (error) {
    alert('Error triggering deployment:')
  }

}
