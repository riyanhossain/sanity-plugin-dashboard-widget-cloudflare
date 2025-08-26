import {DashboardWidgetContainer, type DashboardWidget} from '@sanity/dashboard'
import {Flex, Button, Text, Stack, Box} from '@sanity/ui'
import {WidgetOptions} from './types'
import {handleDeploy} from './deploy'

export default function CloudflareWidget(config: WidgetOptions) {
  let {title, sites} = config
  return (
    <DashboardWidgetContainer header={title || 'Cloudflare Deploys'}>
      <Stack as="ul" space={2}>
        {sites.map((site, index) => {
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
                    onClick={() => handleDeploy(site)}
                    text="Deploy"
                    style={{cursor: 'pointer'}}
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
