<script setup>
  import { avatarText } from '@core/utils/formatters'
  import AppAccessList from '@/views/application/app-access-list.vue'
  import { useUserAppRolesStore } from '@store/userapproles'

  const appRoleStore = useUserAppRolesStore()
  const searchApp = ref('')
  const toast = inject('toast')
  const props = defineProps({
    userApps: {
      type: Array,
      required: true,
    },
  })
  const emit = defineEmits(['removeApp'])
  const filteredApps = computed(() => {
    return props.userApps.filter(item => {
      return item.myApplication.name.toLowerCase().includes(searchApp.value.toLowerCase())
    })
  })

  const removeApp = (app) => {
    emit('removeApp', app)
  }

  const triggerCollapse = async (app) => {
    app.collapsed = !app.collapsed
    if(!app.collapsed && !app.accessLoaded){
      app.accessLoaded = false;
      try{
        const { data } = await appRoleStore.getAppRoles(app.id)
        app.userApplicationRoles = data;
        app.accessList = data.map(item => item.applicationRoleId)
      }catch(e){
        toast.value.showMessage('Something went wrong', 'error')
      }
      app.accessLoaded = true;
    }
  }

  const saveAppChanges = async (app) => {
    let requestData = {
      userApplicationId: app.id,
      roles: app.accessList
    }
    try{
      const { data } = await appRoleStore.addAppRole(requestData)
      if(data.error){
        return toast.value.showMessage(data.errorMessage, 'error')
      }
      toast.value.showMessage('Successfully set the access', 'success')
    }catch(e){
      toast.value.showMessage('Something went wrong', 'error')
    }
  }
</script>
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <VIcon icon="mdi-view-grid-outline" size="40" color="primary"/>
        <div class="d-flex flex-column justify-center ms-2">
          <h4 class="mb-0">User Apps</h4>
          <small>List of Apps that was assigned to this user</small>
        </div>
      </div>
      <div class="w-300">
        <VTextField
          v-model="searchApp"
          label="Search Apps..."
          density="compact"
        />
      </div>
    </div>
    
    
    <!-- loop over userApps -->
    <div v-for="app in filteredApps" :key="app.id">
      <VCard class="mb-3">
        <VCardItem>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <VAvatar
                size="40"
                class="avatar-center bg-grey p5"
                :image="`${app.myApplication.icon}`"
                v-if="app.myApplication.icon"
              />
              <VAvatar
                size="40"
                class="bg-grey p5"
                v-else
              >
                <h2 class="text-primary">{{ avatarText(app.myApplication.name) }}</h2>
              </VAvatar>
              <div class="d-flex flex-column justify-center ms-2">
                <h4 class="l1 mb-0">{{app.myApplication.name}}</h4>
                <a :href="app.myApplication.urlAddress" target="_blank"><small>{{app.myApplication.url}}</small></a>
              </div>
            </div>
            <div>
              <VBtn
                icon="mdi-delete-circle"
                variant="text"
                color="error"
                @click="removeApp(app)"
              />
              <VBtn
                icon="mdi-chevron-right"
                variant="text"
                color="secondary"
                :style="{ transform: !app.collapsed ? 'rotate(90deg)' : null }"
                style="transition-duration: 0.28s;"
                @click="triggerCollapse(app)"
              />
            </div>
          </div>
        </VCardItem>
        <VDivider />
        <VExpandTransition>
          <div
            v-show="!app.collapsed"
            class="v-card-content"
          >
            <AppAccessList 
              :application-id="app.myApplication.id"
              :admin-level="1"
              v-model:selectedAccess="app.accessList"
              v-if="app.accessLoaded"
            />
            <VDivider />
            <div class="text-right pa-3">
              <VBtn class="me-3" @click="saveAppChanges(app)">
                <VIcon icon="mdi-check-outline" class="me-2" />
                Save Changes
              </VBtn>
              <VBtn color="secondary" @click="triggerCollapse(app)">
                <VIcon icon="mdi-close-outline" class="me-2" />
                Cancel
              </VBtn>
            </div>
          </div>
        </VExpandTransition>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
  .w-300 {
    width: 300px;
  }
  .l1{
    line-height: 1;
  }
  .bg-grey{
    background: rgb(var(--v-theme-grey-200));
  }
</style>