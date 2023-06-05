<script setup>
  import AppAccessList from '@/views/application/app-access-list.vue'
  const route = useRoute()
  const props = defineProps({
    appData: {
      type: Object,
      default: () => {},
    },
  })
  const addNew = ref(false)
  const addNewAccess = () => {
    addNew.value = true
  }
</script>
<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <template #title>
          <span class="text-primary">({{ appData.name.toUpperCase() }})</span> Access List
        </template>
        <template #append>
          <div class="me-n3 mt-n2">
            <VBtn @click="addNewAccess">
              <VIcon icon="mdi-plus" /> Add New Access
            </VBtn>
          </div>
        </template>
        <VDivider />
        <AppAccessList v-model:addNew="addNew" :application-id="Number(route.params.id)" :admin-level="2"/>
      </VCard>
    </VCol>
  </VRow>
</template>