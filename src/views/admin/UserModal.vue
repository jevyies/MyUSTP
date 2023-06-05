<script setup>
import { alphaDashValidator, emailValidator, requiredValidator } from '@validators'

const props = defineProps({
  userData: {
    type: Object,
    required: false,
    default: () => ({
      id: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
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

const userData = ref(structuredClone(toRaw(props.userData)))

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      emit('submit', userData.value)
  })
}

const onFormReset = () => {
  userData.value = structuredClone(toRaw(props.userData))
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
              md="6"
            >
              <VTextField
                v-model="userData.firstName"
                label="First Name"
                density="comfortable"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- 👉 Middle Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.middleName"
                label="Middle Name"
                density="comfortable"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.lastName"
                label="Last Name"
                density="comfortable"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- 👉 Status -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.userName"
                label="Username"
                density="comfortable"
                :rules="[requiredValidator, alphaDashValidator]"
              />
            </VCol>
            
            <!-- 👉 Email -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.email"
                label="Email"
                density="comfortable"
                :rules="[requiredValidator, emailValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.password"
                label="Password"
                density="comfortable"
                :rules="[requiredValidator, alphaDashValidator]"
                type="password"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
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
