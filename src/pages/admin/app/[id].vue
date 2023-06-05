<script setup>
import {avatarText} from '@core/utils/formatters'
import AppTabOverview from '@/views/application/AppTabOverview.vue'
import AppTabAccessList from '@/views/application/AppTabAccessList.vue'
import AppTabUsers from '@/views/application/AppTabUsers.vue'
import { localApi } from '@axios'
import { useAppStore } from '@store/app'

const route = useRoute()
const appStore = useAppStore()
const appTab = ref(null)
const appData = ref()
const toast = inject('toast')

const tabs = [
  {
    icon: 'mdi-clipboard-outline',
    title: 'Overview',
  },
  {
    icon: 'mdi-lock-outline',
    title: 'Access List',
  },
  {
    icon: 'mdi-account-check-outline',
    title: 'Users',
  },
]
const fetchIcon = async () => {
    try{
        const {data} = await localApi.get(`${encodeURIComponent(appData.value.url)}`)
        appData.value.image = `data:image/jpeg;base64, ${data.screenshot}`;
        appData.value.icon = data.favIcon
    }catch(error){}
}
const fetchAppData = async () => {
    try{
      const {data} = await appStore.getApp(route.params.id)
      data.urlAddress = `https://${data.url}`
      appData.value = data
      fetchIcon()
    }catch(error){
      toast.value.showMessage('Something went wrong', 'error')
    }
}
onMounted(() => {
    fetchAppData()
})
</script>
<template>
  <section>
    <VRow v-if="appData">
      <VCol
        cols="12"
        md="5"
        lg="4"
      >
        <VRow>
            <VCol cols="12">
              <VCard>
                <VCardText class="text-center">
                  <VBtn
                    variant="tonal"
                    :to="{
                      name: 'admin-applications',
                    }"
                    class="mb-3"
                    block
                  >
                    <VIcon
                      size="24"
                      icon="mdi-chevron-left"
                      class="flip-in-rtl"
                      start
                    />
                    <span>Back to applications</span>
                  </VBtn>
                  <VAvatar
                    rounded
                    :size="`100%`"
                    variant="tonal"
                  >
                    <VImg
                      v-if="appData.image"
                      :src="appData.image"
                    />
                    <span
                      v-else
                      class="text-5xl font-weight-semibold"
                    >
                      {{ avatarText(appData.name) }}
                    </span>
                  </VAvatar>
                </VCardText>
                <VCardText class="d-flex align-center">
                    <VAvatar
                      :size="70"
                      rounded
                      color="secondary"
                      variant="tonal"
                      class="me-3 pa-2"
                    >
                      <VImg
                        v-if="appData.icon"
                        :src="appData.icon"
                      />
                      <h1 class="text-primary" v-else>{{ avatarText(appData.name) }}</h1>
                    </VAvatar>

                    <div>
                      <h6 class="text-h6">
                        {{appData.name}}
                      </h6>
                      <span>{{appData.url}}</span>
                    </div>
                </VCardText>
                <VCardText>
                  <h6 class="text-h6">
                    Details
                  </h6>

                  <VDivider class="mt-4" />

                  <!-- 👉 User Details list -->
                  <VList class="card-list mt-2">
                    <VListItem class="pb-1">
                      <VListItemTitle class="text-sm">
                        <span class="font-weight-medium">Name:</span>
                        <span class="text-body-2 ms-1">
                          {{ appData.name }}
                        </span>
                      </VListItemTitle>
                    </VListItem>
                    <VListItem class="pb-1">
                      <VListItemTitle class="text-sm">
                        <span class="font-weight-medium">Domain Name:</span>
                        <span class="text-body-2 ms-1">
                          {{ appData.url }}
                        </span>
                      </VListItemTitle>
                    </VListItem>
                    <VListItem class="pb-1">
                      <VListItemTitle class="text-sm">
                        <span class="font-weight-medium">URL Link:</span>
                        <span class="text-body-2 ms-1">
                          <a :href="appData.urlAddress" target="_blank">{{ appData.urlAddress }}</a>
                        </span>
                      </VListItemTitle>
                    </VListItem>
                    <VListItem class="pb-1">
                      <VListItemTitle class="text-sm">
                        <span class="font-weight-medium">Created on:</span>
                        <span class="text-body-2 ms-1">
                          {{ appData.createdAt }}
                        </span>
                      </VListItemTitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>
        </VRow>
      </VCol>
      <VCol
        cols="12"
        md="7"
        lg="8"
      >
        <VTabs v-model="appTab">
          <VTab
            v-for="tab in tabs"
            :key="tab.icon"
          >
            <VIcon
              start
              :size="24"
              :icon="tab.icon"
            />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>
        <VDivider />

        <VWindow
          v-model="appTab"
          class="mt-6 disable-tab-transition"
          :touch="false"
        >
          <VWindowItem>
            <AppTabOverview />
          </VWindowItem>

          <VWindowItem>
            <AppTabAccessList :app-data="appData" />
          </VWindowItem>

          <VWindowItem>
            <AppTabUsers :app-data="appData"/>
          </VWindowItem>

        </VWindow>
      </VCol>
    </VRow>
  </section>
</template>
<style scoped>
.card-list .v-list-item:not(:last-child) {
  padding-block-end: 5px !important;
}
</style>
<route lang="yaml">
meta:
  navActiveLink: admin-applications
</route>
