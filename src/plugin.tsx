import React from 'react'
import CloudflareWidget from './CloudflareWidget'
import {WidgetOptions} from './types'
import {DashboardWidget, LayoutConfig} from '@sanity/dashboard'
import {Card, Text} from '@sanity/ui'

export type CloudflareWidgetConfig = WidgetOptions & {layout?: LayoutConfig}

export function cloudflareWidget(config: CloudflareWidgetConfig): DashboardWidget {
  return {
    name: 'cloudflare-widget',
    component: () => {
      if (!config.sites || (config.sites && config.sites.length === 0)) {
        return (
          <Card tone="critical" padding={3}>
            <Text>No sites are defined in the widget options. Please check your config.</Text>
          </Card>
        )
      }
      return <CloudflareWidget {...config} />
    },
    layout: config.layout ?? {width: 'medium'},
  }
}
