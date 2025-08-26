import {WidgetOptionSite} from './types'

export const handleDeploy = async (site: WidgetOptionSite) => {
  if (!site.deployHook) {
    alert('No deploy hook defined for this site.')
    return
  }

  try {
    await fetch(site.deployHook, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
    })
  } catch (error) {
    alert('Error triggering deployment:')
  }
  alert('Deployment triggered successfully!')
}
