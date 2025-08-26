# Sanity Dashboard Widget: Netlify

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
import {cloudflareWidget} from 'sanity-plugin-dashboard-widget-netlify'

export default defineConfig({
  // ...
  plugins: [
    dashboardTool({
      widgets: [
        cloudflareWidget({
          title: 'My Cloudflare deploys',
          sites: [
            {
              title: 'Sanity Studio',
              apiId: 'xxxxx-yyyy-zzzz-xxxx-yyyyyyyy',
              buildHookId: 'xxxyyyxxxyyyyxxxyyy',
              name: 'sanity-gatsby-blog-20-studio',
            },
            {
              title: 'Website',
              apiId: 'yyyyy-xxxxx-zzzz-xxxx-yyyyyyyy',
              buildHookId: 'yyyyxxxxxyyyxxdxxx',
              name: 'sanity-gatsby-blog-20-web',
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

`sites[]` - Your Netlify sites to show deploys for

- `apiId`- The Netfliy API ID of your site (see _Site Settings > General > Site Details > Site Information -> API ID_).
- `buildHookId` - The id of a build hook you have created for your site within the Netlify administration panel (see _Site Settings > Build & Deploy > Continuous Deployment -> Build Hooks_).
- `name` - The Netlify site name
- `title` - Override the site name with a custom title
- `url` - The url.

## License

MIT-licensed. See LICENSE.

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
