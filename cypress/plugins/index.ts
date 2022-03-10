import { baseUrl } from '~/config/site.config'

const plugin: Cypress.PluginConfig = function plugin(on, config): Cypress.ConfigOptions {
  config.baseUrl = baseUrl

  return config
}

export default plugin
