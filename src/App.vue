<script setup>
import { useTheme } from 'vuetify'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import { onMounted } from 'vue'
import LoadingLogo from '@/views/loading-logo.vue'
import Background from '@/views/background.vue'

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
} = useThemeConfig()

const router = useRouter();
const { global } = useTheme()
const toast = ref()
const swal = ref()
const isLoading = ref(true)
// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
provide('toast', toast);
provide('swal', swal);
onMounted(() => {
  isLoading.value = true
})
router.beforeEach(() => {
  isLoading.value = true;
});

router.afterEach(() => {
  isLoading.value = false;
});
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView class="routerView"/>
      <div id="full-page-loader" class="loading-bg-transparent" :class="{'active': isLoading}">
        <LoadingLogo :small-loading="false" :width="86" :height="46"/>
      </div>
      <Background v-if="!isLoading"/>
      <GlobalToast ref="toast" />
      <QuestionDialog ref="swal" />
    </VApp>
  </VLocaleProvider>
</template>
