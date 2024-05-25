// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
// @ts-expect-error this referes to itself, so of course there's no type defintions yet
import Components from '@jakguru/vueprint-components'
import '@jakguru/vueprint/vueprint.css'
import './styles.scss'

export default {
    ...DefaultTheme,
    async enhanceApp({ app }) {
      app.use(Components)
      // @ts-expect-error import.meta.env *is* defined, but not in the type definitions
      if (!import.meta.env.SSR) {
        const { default: VueMainBootstrap } = await import('@jakguru/vueprint/plugins/main')
        const { default: VueClientBootstrap } = await import('@jakguru/vueprint/plugins/client')
        app.use(VueMainBootstrap, {})
        app.use(VueClientBootstrap, {})
      }
    }
  }
  