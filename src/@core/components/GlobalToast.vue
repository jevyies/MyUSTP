<script >
import { ref } from 'vue'
export default {
    name: 'GlobalToast',
    setup(){
        const isShowSnackBar = ref(false)
        const codeValue = ref()
        const messageValue = ref()
        const iconValue = ref('mdi-check-circle-outline')
        
        const showMessage = (message, code) => {
          messageValue.value = message;
          codeValue.value = code;
          isShowSnackBar.value = true;
          if(code.toLowerCase() === 'success'){
            iconValue.value = 'mdi-check-circle-outline'
          }else if(code.toLowerCase() === 'info'){
            iconValue.value = 'mdi-information-outline'
          }else if(code.toLowerCase() === 'warning'){
            iconValue.value = 'mdi-alert-outline'
          }else if(code.toLowerCase() === 'error'){
            iconValue.value = 'mdi-alert-circle-outline'
          }
        }
        return { isShowSnackBar, codeValue, messageValue, iconValue, showMessage }
    }
}
</script>
<template>
    <VSnackbar
      v-model="isShowSnackBar"
      location="top end"
      variant="flat"
      :color="codeValue"
      transition="scroll-y-reverse-transition"
      multi-line
      timeout="3000"
    >
    <div class="snackbar-custom-style">
      <VIcon :icon="iconValue" class="me-2"></VIcon>
      {{ messageValue }}
    </div>
    <template #actions>
      <VBtn
        color="white"
        @click="isShowSnackBar = false"
      >
        <VIcon icon="mdi-close"></VIcon>
      </VBtn>
    </template>
    </VSnackbar>
</template>
<style scoped lang="scss">
  .snackbar-custom-style{
    color: white;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
</style>