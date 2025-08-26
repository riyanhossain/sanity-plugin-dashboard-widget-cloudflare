import {DashboardWidgetContainer, type DashboardWidget} from '@sanity/dashboard'
import {Flex, Button, Text, Stack, Box} from '@sanity/ui'
import {useState} from 'react'
import {WidgetOptions} from './types'
import {handleDeploy} from './deploy'

export default function CloudflareWidget(config: WidgetOptions) {
  const {title, sites} = config
  const [loadingSiteIndex, setLoadingSiteIndex] = useState<number | null>(null)

  const onDeploy = async (siteIndex: number) => {
    if (loadingSiteIndex !== null) return
    setLoadingSiteIndex(siteIndex)
    try {
      await handleDeploy(sites[siteIndex])
    } finally {
      setLoadingSiteIndex(null)
    }
  }

  return (
    <DashboardWidgetContainer header={title || 'Cloudflare Deploys'}>
      <Stack as="ul" space={2}>
        {sites.map((site, index) => {
          const isLoading = loadingSiteIndex === index
          return (
            <Flex as="li" key={`site-${index}`}>
              <Box flex={1} paddingY={2} paddingX={3}>
                <Stack space={2}>
                  <Text as="h4">
                    <span>
                      <a href={site.url} target="_blank" rel="noreferrer">
                        {site.title}
                      </a>
                    </span>
                  </Text>
                </Stack>
              </Box>
              {site.deployHook ? (
                <Box paddingY={2} paddingX={3}>
                  <Button
                    mode="ghost"
                    onClick={() => onDeploy(index)}
                    text={isLoading ? 'Deploying…' : 'Deploy'}
                    disabled={isLoading || loadingSiteIndex !== null}
                    tone={isLoading ? 'primary' : 'default'}
                    style={{cursor: isLoading ? 'progress' : 'pointer'}}
                  />
                </Box>
              ) : null}
            </Flex>
          )
        })}
      </Stack>
    </DashboardWidgetContainer>
  )
}
