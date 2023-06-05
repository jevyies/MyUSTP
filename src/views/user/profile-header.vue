<script setup>
import ApplicationUserModal from '@/views/user/application-user-modal.vue'

const route = useRoute()
const modalDialogVisible = ref(false)
const props = defineProps({
  activeTab: {
    type: String,
    default: 'profile'
  },
  profileHeaderData: {
    type: Object,
    required: true,
  },
  apps: {
    type: Array,
    required: true,
  },
  userApps: {
    type: Array,
    required: true,
  },
})
const contentApps = ref([])
const emit = defineEmits(['updateUser', 'submitUserApplication'])
const submitUserApplication = (selectedApps) => {
  modalDialogVisible.value = false
  emit('submitUserApplication', selectedApps)
}
const removeIncludedApps = (userApps, apps) => {
  const userAppIds = props.userApps.map(item => item.id)
  // push to content apps
  contentApps.value = props.apps.filter(item => !userAppIds.includes(item.id))
}
</script>

<template>
  <VCard v-if="props.profileHeaderData">
    <VImg
      :src="props.profileHeaderData.coverImg"
      min-height="125"
      max-height="250"
      cover
    />

    <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-6">
      <div class="d-flex h-0">
        <VAvatar
          rounded
          size="120"
          :image="props.profileHeaderData.profileImg"
          class="user-profile-avatar mx-auto"
        />
      </div>

      <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
        <h5 class="text-h5 text-center text-sm-start mb-3">
          {{ props.profileHeaderData.fullName }}
        </h5>

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-4">
          <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-3">
            <span class="d-flex align-center">
              <VIcon
                size="24"
                icon="mdi-invert-colors"
                class="me-2"
              />
              <span class="text-body-1 font-weight-semibold">
                {{ props.profileHeaderData.designation }}
              </span>
            </span>

            <span class="d-flex align-center">
              <VIcon
                size="24"
                icon="mdi-map-marker-outline"
                class="me-2"
              />
              <span class="text-body-1 font-weight-semibold">
                {{ props.profileHeaderData.location }}
              </span>
            </span>

            <span class="d-flex align-center">
              <VIcon
                size="24"
                icon="mdi-calendar-blank"
                class="me-2"
              />
              <span class="text-body-1 font-weight-semibold">
                {{ props.profileHeaderData.joiningDate }}
              </span>
            </span>
          </div>

          <VBtn prepend-icon="mdi-account-cog-outline" v-if="props.activeTab === 'profile'">
            Update
          </VBtn>
          <VDialog
            :width="$vuetify.display.smAndDown ? 'auto' : 800"
            v-model="modalDialogVisible"
            persistent
            v-if="props.activeTab === 'apps'"
          >
            <template #activator="{ props }">
              <VBtn prepend-icon="mdi-view-grid-plus-outline" v-bind="props" @click="removeIncludedApps">
                Add More Applications
              </VBtn>
            </template>
            <ApplicationUserModal 
              :isDialogVisible="modalDialogVisible"
              :user-id="route.params.id"
              title="Add Application"
              sub-title="Add Application to User"
              :apps="contentApps"
              @submit="submitUserApplication"
              @close="modalDialogVisible = false"
            />
          </VDialog>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}
</style>
