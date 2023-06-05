<script setup>
import UserModal from '@/views/admin/UserModal.vue'
import { useUserStore } from '@store/user'
import { useUserSignUpStore } from '@store/usersignup'
import { avatarText } from '@core/utils/formatters'
import router from '@/router'

const userStore = useUserStore()
const userSignUpStore = useUserSignUpStore()
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const users = ref([])
const isUserModalVisible = ref(false)
const modalTitle = ref('')
const userLoading = ref(false)
const userVSelect = ref('Pending')
const toast = inject('toast');
const swal = inject('swal');
const searchUser = ref('')
const userData = ref({
  id: 0,
  firstName: '',
  middleName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
})

// 👉 Fetching users
const fetchUsers = async (type) => {
  users.value = [];
  userLoading.value = true
  try{
    var responseData = []
    if(type.toLowerCase() === 'admin'){
      const { data } = await userStore.getAllUsers();
      responseData = data
    }else if(type.toLowerCase() === 'approved'){
      const { data } = await userSignUpStore.getApprovedUsers();
      responseData = data
    }else{
      const { data } = await userSignUpStore.getPendingUsers();
      responseData = data
    }
    responseData.map(user => {
      user.fullName = `${user.firstName} ${user.lastName}`
      user.role = 'subscriber';
      user.status = 'pending';
    })
    users.value = responseData;
    totalPage.value = Math.ceil(responseData.length/rowPerPage.value);
    currentPage.value = 1;
  }catch(e){
    toast.value.showMessage('Something went wrong', 'error')
  }
  userLoading.value = false
}

onMounted(() => {
  fetchUsers('pending')
})

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 search filters
const roles = []

const status = []

const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'subscriber')
    return {
      color: 'primary',
      icon: 'mdi-account-outline',
    }
  if (roleLowerCase === 'author')
    return {
      color: 'warning',
      icon: 'mdi-cog-outline',
    }
  if (roleLowerCase === 'maintainer')
    return {
      color: 'success',
      icon: 'mdi-chart-donut',
    }
  if (roleLowerCase === 'editor')
    return {
      color: 'info',
      icon: 'mdi-pencil-outline',
    }
  if (roleLowerCase === 'admin')
    return {
      color: 'error',
      icon: 'mdi-laptop',
    }
  
  return {
    color: 'primary',
    icon: 'mdi-account-outline',
  }
}

// SECTION Checkbox toggle
const selectedRows = ref([])
const selectAllUser = ref(false)

// 👉 add/remove all checkbox ids in array
const selectUnselectAll = () => {
  selectAllUser.value = !selectAllUser.value
  if (selectAllUser.value) {
    users.value.forEach(user => {
      if (!selectedRows.value.includes(`check${ user.id }`))
        selectedRows.value.push(`check${ user.id }`)
    })
  } else {
    selectedRows.value = []
  }
}

// 👉 watch if checkbox array is empty all select should be uncheck
watch(selectedRows, () => {
  if (!selectedRows.value.length)
    selectAllUser.value = false
}, { deep: true })

const addRemoveIndividualCheckbox = checkID => {
  if (selectedRows.value.includes(checkID)) {
    const index = selectedRows.value.indexOf(checkID)

    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(checkID)
    selectAllUser.value = true
  }
}
const addUser = () => {
  isUserModalVisible.value = true;
  modalTitle.value = 'Add User';
  userData.value = {
    id: 0,
    firstName: '',
    middleName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  }
}
const addNewUser = async userData => {
  var responseData = {};
  if(userData.id > 0){
    const { data } =  await userStore.signUp(userData)
    responseData = data;
  }else{
    const { data } =  await userStore.signUp(userData)
    responseData = data;
  }
  isUserModalVisible.value = false;
}

const computedMoreList = computed(() => {
  return params => [
    {
      title: 'Approve',
      value: 'approve',
      prependIcon: 'mdi-check',
      color: 'success',
      params: params,
      hide: userVSelect.value.toLowerCase() === 'approved' || userVSelect.value.toLowerCase() === 'admin'
    },
    {
      title: 'Reject',
      value: 'reject',
      prependIcon: 'mdi-hand-back-left',
      color: 'error',
      params: params,
      hide: userVSelect.value.toLowerCase() === 'approved' || userVSelect.value.toLowerCase() === 'admin'
    },
    {
      title: 'View User',
      value: 'view',
      prependIcon: 'mdi-eye-outline',
      color: 'secondary',
      params: params,
      hide: userVSelect.value.toLowerCase() === 'pending'
    },
  ]
})
const editUser = params => {
  isUserModalVisible.value = true;
  modalTitle.value = 'Edit User';
  userData.value = params
}
const viewUser = (params) => {
  router.push({ name: 'admin-user-id', params: { id: params.id } })
}
const handleMoreClick = ({params, value}) => {
  if (value === 'approve') {
    approveUser(params);
  } else if (value === 'reject') {
    rejectUser(params);
  } else if (value === 'view') {
    viewUser(params);
  }
}
watch(userVSelect, (val, oldVal) => {
  fetchUsers(val)
})
const approveUser = async (params) => {
  swal.value.fire({
    question: 'Are you sure you want to approve this user?',
  }).then(async (result) => {
    if (result) {
      try{
        const { data } =  await userStore.approveUser(params.id)
        if(data.error){
          return toast.value.showMessage(data.errorMessage, 'error')
        }
        let index = users.value.findIndex(user => user.id == params.id);
        users.value.splice(index, 1);
        toast.value.showMessage('Successfully approved', 'success')
      }catch(e){
        toast.value.showMessage('Something went wrong', 'error')
      }
    }
  })
}

const rejectUser = async (params) => {
  swal.value.fire({
    question: 'Are you sure you want to reject this user?',
    dangerMode: true
  }).then(async (result) => {
    if (result) {
      try{
        const { data } =  await userStore.rejectUser(params.id)
        if(data.error){
          return toast.value.showMessage(data.errorMessage, 'error')
        }
        let index = users.value.findIndex(user => user.id == params.id);
        users.value.splice(index, 1);
        toast.value.showMessage('Successfully rejected', 'success')
      }catch(e){
        toast.value.showMessage('Something went wrong', 'error')
      }
    }
  })
}

const filteredUsers = computed(() => {
  let data = users.value;
  var total = currentPage.value * rowPerPage.value;
  if (searchUser.value.trim() != "" && searchUser.value) {
    data = data.filter((item) => {
      return item.fullName
        .toUpperCase()
        .includes(searchUser.value.toUpperCase());
    });
  }
  var currentData = data.slice(total - rowPerPage.value, total);
  if (currentPage.value > 1 && currentData.length == 0) {
    total = (currentPage.value - 1) * rowPerPage.value;
    currentData = data.slice(total - rowPerPage.value, total);
  }
  return currentData;
})

const userRows = computed(() => {
  let data = users.value;
  if (searchUser.value.trim() != "" && searchUser.value) {
    data = data.filter((item) => {
      return item.fullName
        .toUpperCase()
        .includes(searchUser.value.toUpperCase());
    });
  }
  return Math.ceil(data.length / rowPerPage.value);
})
</script>

<template>
  <section>
    <div>
        <h1>Users</h1>
        <p>Here you can manage your users.</p>
    </div>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <!-- 👉 Export button -->
        <VTextField
          v-model="searchUser"
          placeholder="Search User..."
          density="compact"
        />
        <div style="width:90px;">
          <VSelect
            v-model="rowPerPage"
            density="compact"
            :items="[10, 20, 30, 50, 100]"
          />
        </div>
        

        <VSpacer />
        <div class="app-user-search-filter d-flex align-center gap-6">
          <!-- 👉 Search  -->
          <VSelect
            v-model="userVSelect"
            density="compact"
            :items="['Pending', 'Approved', 'Admin']"
          />
          <!-- 👉 Add user button -->
          <VBtn color="primary" @click="addUser">
            <VIcon icon="mdi-account-plus" />
            Add User
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th
              scope="col"
              style="width: 3rem;"
            >
              <VCheckbox
                :model-value="selectAllUser"
                :indeterminate="(users.length !== selectedRows.length) && !!selectedRows.length"
                class="mx-1"
                @click="selectUnselectAll"
              />
            </th>
            <th scope="col">
              USER
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              ROLE
            </th>
            <th scope="col" width="90px">
              ACTIONS
            </th>
          </tr>
        </thead>

        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
          >
            <!-- 👉 Checkbox -->
            <td>
              <VCheckbox
                :id="`check${user.id}`"
                :model-value="selectedRows.includes(`check${user.id}`)"
                class="mx-1"
                @click="addRemoveIndividualCheckbox(`check${user.id}`)"
              />
            </td>

            <!-- 👉 User -->
            <td>
              <div class="d-flex align-center">
                <VAvatar
                  variant="tonal"
                  :color="resolveUserRoleVariant(user.role).color"
                  class="me-3"
                  size="34"
                >
                  <VImg
                    v-if="user.avatar"
                    :src="user.avatar"
                  />
                  <span
                    v-else
                    class="text-sm"
                  >{{ avatarText(user.fullName) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-sm">
                    <!-- <RouterLink
                      :to="{ name: 'apps-user-view-id', params: { id: user.id } }"
                      class="font-weight-medium user-list-name"
                    > -->
                      {{ user.fullName }}
                    <!-- </RouterLink> -->
                  </h6>
                  <span class="text-xs">@{{ user.userName }}</span>
                </div>
              </div>
            </td>

            <!-- 👉 Email -->
            <td>
              {{ user.email }}
            </td>

            <!-- 👉 Role -->
            <td>
              <div class="d-flex align-center">
                <VIcon
                  :icon="resolveUserRoleVariant(user.role).icon"
                  :color="resolveUserRoleVariant(user.role).color"
                  :size="22"
                  class="me-3"
                />
                <span class="text-capitalize text-base">{{ user.role }}</span>
              </div>
            </td>
            

            <!-- 👉 Actions -->
            <td
              class="text-center"
              style="width: 5rem;"
            >
              <MoreBtn
                :menu-list="computedMoreList(user)"
                :item-props="true"
                @item-click="handleMoreClick"
              />
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!userLoading && !users.length">
          <tr>
            <td
              colspan="6"
              class="text-center"
            >
              No data available
            </td>
          </tr>
        </tfoot>
        <tfoot v-show="userLoading">
          <tr>
            <td colspan="6" class="text-center">Loading...</td>
          </tr>
        </tfoot>
      </VTable>

      <VDivider />

      <VCardText class="d-flex align-center flex-wrap justify-end gap-4 pa-2">

        <div class="d-flex align-center">
          <VPagination
            v-model="currentPage"
            size="small"
            :length="userRows"
            :total-visible="5"
            @next="selectedRows = []"
            @prev="selectedRows = []"
          />
        </div>
      </VCardText>
    </VCard>
    <!-- 👉 Add New User -->
    <UserModal
      v-model:isDialogVisible="isUserModalVisible"
      :user-data="userData"
      :title="modalTitle"
      @submit="addNewUser"
    />
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 24.0625rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
