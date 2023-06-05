<script setup>
import { avatarText } from '@core/utils/formatters'
const props = defineProps({
  websites: {
    type: Array,
    default: () => ([])
  }
})
const search = ref('')
const filteredApps = computed(() => {
  return props.websites.filter(app => app.name.toLowerCase().includes(search.value.toLowerCase()))
})
const goToPage = (app) => {
  window.open(app.urlAddress, '_blank')
}
</script>
<template>
  <div>
    <VRow >
      <VCol 
        cols="12"
        sm="12"
        md="6"
        lg="9"
      >
        <h2 class="d-flex align-items-end">
          <VIcon icon="mdi-view-grid" color="primary" class="me-1"/> My Apps
        </h2>
      </VCol>
      <VCol 
        cols="12"
        sm="12"
        md="6"
        lg="3"
      >
        <VTextField
            prepend-inner-icon="mdi-search"
            density="compact"
            label="Search for an application..."
            v-model="search"
        />
      </VCol>
    </VRow>
    <VRow>
        <VCol
          cols="12"
          sm="12"
          md="6"
          lg="4"
          v-for="app in filteredApps"
          :key="app.id"
        >
            <VCard>
                <VCardItem class="hover-zoom cursor-pointer" @click="goToPage(app)">
                    <VAvatar
                        rounded
                        :size="`100%`"
                        variant="tonal"
                    >
                        <VImg
                            v-if="app.image"
                            :src="app.image"
                            height="100%"
                        />
                        <span
                            v-else
                            class="text-5xl font-weight-semibold py-7"
                        >
                            {{ avatarText(app.name) }}
                        </span>
                    </VAvatar>
                </VCardItem>
                <VCardText class="d-flex align-center">
                    <VAvatar
                      :size="70"
                      rounded
                      color="secondary"
                      variant="tonal"
                      class="me-3 pa-2"
                    >
                      <VImg
                        v-if="app.icon"
                        :src="app.icon"
                      />
                      <h1 class="text-primary" v-else>{{ avatarText(app.name) }}</h1>
                    </VAvatar>

                    <div>
                      <h6 class="text-h6">
                        {{app.name}}
                      </h6>
                      <a :href="app.urlAddress" target="_blank">{{app.url}}</a>
                    </div>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
  </div>
</template>
<style lang="scss">
.hover-zoom {
  transition: all 0.5s ease-out;
}

.hover-zoom:hover {
  transform: scale(1.03);
}
</style>