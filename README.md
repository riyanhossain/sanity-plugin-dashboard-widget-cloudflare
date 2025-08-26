# Sanity Dashboard Widget: Cloudflare

> This is a **Sanity Studio v3** plugin.

Sanity Studio Dashboard Widget for triggering Cloudflare builds.

## Install

```
npm install --save sanity-plugin-dashboard-widget-cloudflare
```

or

```
yarn add sanity-plugin-dashboard-widget-cloudflare
```

Ensure that you have followed install and usage instructions for [@sanity/dashboard](https://github.com/sanity-io/dashboard).

## Usage

Add it as a widget to @sanity/dashboard plugin in sanity.config.ts (or .js):

```js
import {dashboardTool} from '@sanity/dashboard'
import {cloudflareWidget} from 'sanity-plugin-dashboard-widget-cloudflare'

export default defineConfig({
  // ...
  plugins: [
    dashboardTool({
      widgets: [
        cloudflareWidget({
          title: 'My Cloudflare deploys',
          sites: [
            {
              title: 'Staging',
              deployHook:
                'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxx-yyyy-zzzz-xxxx-yyyyyyyy',
              url: 'https://stagign.my-sanity-deployment.com',
            },
            {
              title: 'Production',
              deployHook:
                'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxx-yyyy-zzzz-xxxx-yyyyyyyy',
              url: 'https://my-sanity-deployment.com',
            },
          ],
        }),
      ],
    }),
  ],
})
```

### Widget options

`title` - Override the widget default title

`sites[]` - Your Cloudflare sites to show deploys for

- `title` - Override the site name with a custom title
- `deployHook` - The id of a build hook you have created for your site within the Cloudflare administration panel.
- `url` - The url.

## License

MIT-licensed. See LICENSE.
