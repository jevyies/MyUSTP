/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@axios'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { globalFunctions, globalRefs } from './constants'
loadFonts()


// Create vue app
const app = createApp(App)


// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})
app.provide('globalRefs', globalRefs);
app.provide('globalFunctions', globalFunctions);
app.directive('resize', {
  inserted: function(el, binding) {
    const onResizeCallback = binding.value;
    window.addEventListener('resize', () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      onResizeCallback({ width, height });
    })
  }
})
// Mount vue app
app.mount('#app')
