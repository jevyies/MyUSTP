<script setup>
import { requiredValidator } from '@validators'
import { useAppRoleStore } from '@store/approles'
import { ref } from 'vue'
const emit = defineEmits(['update:addNew', 'update:selectedAccess'])
const appRoleStore = useAppRoleStore()
const toast = inject('toast')
const swal = inject('swal')
const accessLoading = ref(false)
const props = defineProps({
  addNew: {
    type: Boolean,
    default: false,
  },
  applicationId: {
    type: Number,
    default: 0,
  },
  adminLevel: {
    type: Number,
    default: 0,
  },
  selectedAccess: {
    type: Array,
    default: () => [],
  },
})
const selected = ref(structuredClone(toRaw(props.selectedAccess)))
watch(props, async() => {
  if(props.selectedAccess.length > 0){
    selected.value = structuredClone(toRaw(props.selectedAccess))
  }
  if(props.addNew){
    await nextTick()
    addAccessInput.value.focus()
  }
})
const route = useRoute()
const initialAccessValue = {
  id: 0,
  role: '',
  applicationId: props.applicationId
}
const access = reactive({...initialAccessValue})
const refVAccess = ref()
const accessList = ref([])
const refItems = ref([])
const refVItems = ref([])
const addAccessInput = ref()
const onAccessSubmit = () => {
  refVAccess.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
    saveAccess()
  })
}

const onUpdateAccess = (acc) => {
  let index = accessList.value.findIndex(x => x.id == acc.id);
  refVItems.value[index].value[0].validate().then(({ valid: isValid }) => {
    if (isValid)
    updateAccess(acc)
  })
}

const saveAccess = async() => {
  try{
    const { data } = await appRoleStore.createAppRole(access)
    if(data.error){
      return toast.value.showMessage(data.errorMessage, 'error')
    }
    toast.value.showMessage('Successfully added', 'success')
    access.roleCopy = structuredClone(access.role);
    accessList.value.push(structuredClone(toRaw(access)))
    access.role = ''
    refVAccess.value?.reset()
  }catch(e){
    toast.value.showMessage('Something went wrong', 'error')
  }
}

const updateAccess = async(acc) => {
  try{
    const { data } = await appRoleStore.updateAppRole(acc)
    if(data.error){
      return toast.value.showMessage(data.errorMessage, 'error')
    }
    acc.roleCopy = structuredClone(acc.role);
    acc.editMode = false;
    toast.value.showMessage('Successfully updated', 'success')
  }catch(e){
    toast.value.showMessage('Something went wrong', 'error')
  }
}

const getAccessList = async() => {
  accessLoading.value = true
  try{
    const { data } = await appRoleStore.getAppRoles(props.applicationId)
    data.forEach(item => {
      item.editMode = false;
      item.roleCopy = structuredClone(item.role);
    })
    accessList.value =  data;
    await nextTick()
    accessList.value.forEach((item, index) => {
      refItems.value[index] = toRef(item, 'ref');
      refVItems.value[index] = toRef(item, 'refV');
    })
  }catch(e){
    toast.value.showMessage('Something went wrong', 'error')
  }
  accessLoading.value = false
}
onMounted(async () => {
  await getAccessList()
})

const deleteAccess = async (id) => {
  const result = await swal.value.fire({question: `Are you sure you want to delete this access?`, dangerMode: true})
  if (!result) return
  try{
    const { data } = await appRoleStore.deleteAppRole(id)
    if(data.error){
      return toast.value.showMessage(data.errorMessage, 'error')
    }
    let index = accessList.value.findIndex(x => x.id == id);
    accessList.value.splice(index, 1);
  }catch(e){
    toast.value.showMessage('Something went wrong', 'error')
  }
}

const updateSelectedAccess = () => {
  emit('update:selectedAccess', selected.value)
}

const clickUpdAcc = async (acc, index) => {
  if(props.addNew){
    emit('update:addNew', false)
  }
  acc.editMode = true;
  await nextTick();
  refItems.value[index].value[0].focus()
}

const cancelEditAccess = (acc) => {
  acc.editMode = false;
  acc.role = structuredClone(acc.roleCopy);
}
</script>
<template>
  <div class="pa-3" v-if="props.addNew">
    <VForm ref="refVAccess" @submit.prevent="onAccessSubmit" class="d-flex">
        <VTextField 
          label="Access Description" 
          density="compact" 
          class="me-2" 
          v-model="access.role" 
          :rules="[requiredValidator]"
          ref="addAccessInput"
        />
        <VBtn variant="outlined" color="success" class="me-2" type="submit">
          <VIcon icon="mdi-content-save"/> Save
        </VBtn>
        <VBtn variant="outlined" color="secondary" @click="emit('update:addNew', false)">
          <VIcon icon="mdi-close-outline" /> Cancel
        </VBtn>
    </VForm>
  </div>
  <div class="px-4 py-3">
    <div v-if="accessLoading" class="text-center">
      <VProgressCircular indeterminate />
    </div>
    <div v-if="accessList.length == 0 && !props.addNew" class="text-center">
      <h4 class="mb-0">No data found</h4>
    </div>
    <template v-for="(acc, index) in accessList" :key="acc.id">
      <div v-if="props.adminLevel == 2">
        <VChip color="secondary" class="mb-2 w-100 d-flex justify-space-between py-2 pe-0" >
          <template v-if="!acc.editMode">
            <h3>{{acc.role}}</h3>
            <div>
              <VBtn color="secondary" size="small" @click="clickUpdAcc(acc, index)" icon="mdi-edit" variant="text" />
              <VBtn color="error" size="small" @click="deleteAccess(acc.id)" icon="mdi-close-circle" variant="text" />
            </div>
          </template>
          <template v-else>
            <VForm :ref="refVItems[index]" @submit.prevent="onUpdateAccess(acc)" class="d-flex w-100">
              <VTextField 
                label="Access Description" 
                density="compact" 
                class="me-2 old-input no-error-message" 
                single-line
                v-model="acc.role" 
                :ref="refItems[index]"
                :rules="[requiredValidator]"
              />
            </VForm>
            <div>
              <VBtn size="small" @click="onUpdateAccess(acc)" icon="mdi-content-save" variant="text" />
              <VBtn color="secondary" size="small" @click="cancelEditAccess(acc)" icon="mdi-close-circle" variant="text" />
            </div>
          </template>
        </VChip>
      </div>
      <div class="d-flex align-items-center mb-1" v-else>
        <VCheckbox
          v-model="selected"
          :label="acc.role"
          :value="acc.id"
          @change="updateSelectedAccess"
        />
      </div>
    </template>
  </div>
</template>
