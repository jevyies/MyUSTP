<script setup>
import { requiredValidator } from '@validators'
import ApplicationCheckboxes from '@/views/user/application-checkboxes.vue'

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
  subTitle: {
    type: String,
    required: false,
    default: '',
  },
  apps: {
    type: Array,
    required: true,
  },
})
const refVForm = ref()
const selectedCheckedApps = ref([])
const searchApp = ref('')

const emit = defineEmits(['submit', 'close'])
const closeDialog = () => {
  emit('close')
}
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      emit('submit', selectedCheckedApps.value)
  })
}
const filteredApps = computed(() => {
  return props.apps.filter(item => {
    return item.name.toLowerCase().includes(searchApp.value.toLowerCase())
  })
})
</script>

<template>
  <VCard class="pa-sm-9 pa-5">
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn
      variant="text"
      size="small"
      @click="closeDialog"
    />

    <VCardItem class="text-center">
      <VCardTitle class="text-h5 mb-2">
        {{title}}
      </VCardTitle>
      <VCardSubtitle>
        {{subTitle}}
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <!-- 👉 Form -->
      <VForm
        class="mt-3"
        ref="refVForm"
        @submit.prevent="onFormSubmit"
      >
        <div class="mb-5">
          <VTextField
            prepend-inner-icon="mdi-search"
            density="compact"
            single-line
            placeholder="Search for an application..."
            v-model="searchApp"
            v-if="props.apps.length > 0"
          />
        </div>
        <ApplicationCheckboxes
          v-model:selected-checkbox="selectedCheckedApps"
          :checkbox-content="filteredApps"
          :grid-column="{ sm: '6', cols: '12' }"
          v-if="props.apps.length > 0"
        />
        <div v-else>
          <VAlert
            type="warning"
            outlined
            elevation="0"
            class="mb-5"
          >
            No more application found.
          </VAlert>
        </div>
        <div class="d-flex flex-wrap justify-center gap-4 mt-5">
          <VBtn type="submit" v-if="selectedCheckedApps.length > 0">
            Submit {{selectedCheckedApps.length}} selected Application
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="closeDialog"
          >
            Cancel
          </VBtn>
        </div>

      </VForm>
    </VCardText>
  </VCard>
</template>
