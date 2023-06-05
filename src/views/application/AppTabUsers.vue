<script setup>
  const props = defineProps({
    appData: {
      type: Object,
      default: () => {},
    },
  })
</script>
<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <template #title>
          <span class="text-primary">({{ appData.name.toUpperCase() }})</span> User List
        </template>
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                PROJECT
              </th>
              <th scope="col">
                TOTAL TASK
              </th>
              <th scope="col">
                PROGRESS
              </th>
              <th scope="col">
                HOURS
              </th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>