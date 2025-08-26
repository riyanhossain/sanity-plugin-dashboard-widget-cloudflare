export interface WidgetOptionSite {
  title: string
  deployHook: string
  url: string
}

export interface WidgetOptions {
  title?: string
  sites: WidgetOptionSite[]
}
