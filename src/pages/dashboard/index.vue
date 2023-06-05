<script setup>
import AnalyticsCongratulationsJohn from '@/views/dashboard/ProfileCard.vue'
import MyApps from '@/views/dashboard/MyApps.vue'
import { useUserApplicationStore } from '@store/userapplication'
import {localApi} from '@axios'

const websites = ref([])
const appLoading = ref(false)
const userAppStore = useUserApplicationStore()
const fetchIcons = async (website) => {
    try{
      const {data} = await localApi.get(`${encodeURIComponent(website.url)}`)
      website.image = data.screenshot ? `data:image/jpeg;base64, ${data.screenshot}` : null;
      website.icon = data.favIcon
    }catch(error){
      website.image = null;
      website.icon = null;
    }
}
const fetchApps = async () => {
    appLoading.value = true;
    websites.value = []
    const { data } = await userAppStore.getMyApps()
    let apps = [];
    data.map((app) => apps.push(app.myApplication))
    for await (const website of apps){
      website.urlAddress = `https://${website.url}`
      await fetchIcons(website)
      websites.value.push(website)
    }
    appLoading.value = false;
}
onMounted(async () => {
  fetchApps()
})
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Congratulations John -->
    <VCol
      cols="12"
      md="12"
      lg="12"
    >
      <AnalyticsCongratulationsJohn />
    </VCol>
    <VCol
      cols="12"
      md="12"
      lg="12"
    >
      <MyApps :websites="websites"/>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
<route lang="yaml">
meta:
  action: read
  subject: MereUser
</route>