<script setup>
import { useRoute } from 'vue-router'
import UserProfileHeader from '@/views/user/profile-header.vue'
import UserProfile from '@/views/user/profile.vue'
import UserApps from '@/views/user/apps.vue'
import {useUserApplicationStore} from '@store/userapplication'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import avatar1 from '@images/avatars/avatar-1.png'
import UserProfileHeaderBg from '@images/pages/user-profile-header-bg.png'
import axios from 'axios'

const appStore = useAppStore()
const userStore = useUserStore()
const userApplicationStore = useUserApplicationStore()
const route = useRoute()
const toast = inject('toast')
const swal = inject('swal')
const globalRefs = inject('globalRefs')
const globalFunctions = inject('globalFunctions')
const activeTab = ref('profile')
const userApps = ref([])
const profileHeaderData = ref({})
const apps = ref([])
// tabs
const tabs = [
  {
    title: 'Profile',
    icon: 'mdi-account-outline',
    tab: 'profile',
  },
  {
    title: 'Applications',
    icon: 'mdi-view-grid-outline',
    tab: 'apps',
  },
]
const updateUser = () => {
  console.log('update user')
}
const fetchApps = async () => {
  try{
    const { data } = await appStore.getAllApps()
    if(data.error){
      return toast.value.showMessage(data.errorMessage, 'error')
    }
    for await (const app of data){
      try{
        const { data: responseData } = await axios.get(`${globalRefs.CLIENT_SERVER_URL}/${encodeURIComponent(app.url)}`)
        app.icon = responseData.favIcon
      }catch(error){} 
    }
    apps.value = data
  }catch(error){
    toast.value.showMessage('Something went wrong fetching apps', 'error')
  }
}
const getUserApps = async () => {
  try{
    const { data } = await userApplicationStore.getUserApps(route.params.id)
    if(data.error){
      return toast.value.showMessage(data.errorMessage, 'error')
    }
    data.map(item => {
      item.myApplication.icon = apps.value.find(app => app.id == item.myApplication.id)?.icon || null;
      item.myApplication.urlAddress = `https://${item.myApplication.url}`
      item.collapsed = true;
      item.accessList = [];
      item.accessLoaded = false;
    })
    userApps.value = data
  }catch(error){
    toast.value.showMessage('Something went wrong - getting user apps', 'error')
  }
}
const fetchHeaderData = async () => {
  try{
    const { data } = await userStore.getUser(route.params.id)
    if(data.error){
        return toast.value.showMessage(data.errorMessage, 'error')
    }
    data.fullName = `${data.firstName} ${data.lastName}`.trim();
    data.designation = `Computer Programmer`
    data.location = `Digital Transformation Office`
    data.joiningDate = `May 1, 2021`
    data.coverImg = UserProfileHeaderBg;
    data.profileImg = avatar1;
    profileHeaderData.value = data;
  }catch(error){
    toast.value.showMessage('Something went wrong', 'error')
  }
}
onMounted(async () => {
  globalFunctions.pageLoader(true)
  await fetchHeaderData()
  await fetchApps()
  await getUserApps()
  globalFunctions.pageLoader(false)
})
const submitUserApplication = async(selectedApps) => {
  try{
    const { data } = await userApplicationStore.addUserApps(route.params.id, selectedApps)
    if(data.error){
      return toast.value.showMessage(data.errorMessage, 'error')
    }
    selectedApps.map(item => {
      let app = apps.value.find(app => app.id == item)
      userApps.value.push(app)
    })
    toast.value.showMessage('Successfully added', 'success')
  }catch(error){
    toast.value.showMessage('Something went wrong', 'error')
  }
}
const removeApp = (app) => {
  swal.value.fire({
    question: 'Are you sure you want to remove this app from this user?',
    dangerMode: true,
  }).then(async (result) => {
    if(result){
      try{
        const { data } = await userApplicationStore.removeUserApp(app.id)
        if(data.error){
          return toast.value.showMessage(data.errorMessage, 'error')
        }
        let index = userApps.value.findIndex(item => item.id == app.id)
        userApps.value.splice(index, 1)
        toast.value.showMessage('Successfully removed', 'success')
      }catch(error){
        toast.value.showMessage('Something went wrong', 'error')
      }
    }
  })
}
</script>

<template>
  <div>
    <UserProfileHeader 
        class="mb-5" 
        :active-tab="activeTab"
        :profile-header-data="profileHeaderData"
        :apps="apps"
        :user-apps="userApps"
        @update-user="updateUser"
        @submit-user-application="submitUserApplication"
    />

    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
      density="compact"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Profile -->
      <VWindowItem value="profile">
        <UserProfile />
      </VWindowItem>

      <!-- Projects -->
      <VWindowItem value="apps">
        <UserApps 
          :user-apps="userApps"
          @remove-app="removeApp"
        />
      </VWindowItem>

    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: admin-users
</route>
