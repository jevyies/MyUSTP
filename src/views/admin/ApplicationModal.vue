<script setup>
import { requiredValidator } from '@validators'

const props = defineProps({
  appData: {
    type: Object,
    required: false,
    default: () => ({
      id: 0,
      name: '',
      description: '',
      url: '',
    }),
  },
  isDialogVisible: {
    type: Boolean,
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
})
const refVForm = ref()

const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])

const appData = ref(structuredClone(toRaw(props.appData)))
watch(props, () => {
    appData.value = structuredClone(toRaw(props.appData))
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      emit('submit', appData.value)
  })
}

const onFormReset = () => {
  appData.value = structuredClone(toRaw(props.appData))
  emit('update:isDialogVisible', false)
}

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 800"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
    persistent
  >
    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="onFormReset"
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
          <VRow>
            <!-- 👉 Full Name -->
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="appData.name"
                label="Application Name"
                density="comfortable"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- 👉 Middle Name -->
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="appData.description"
                label="Description"
                density="comfortable"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="appData.url"
                label="Domain Name"
                density="comfortable"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
