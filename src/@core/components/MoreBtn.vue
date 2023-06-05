<script setup>
const props = defineProps({
  menuList: {
    type: Array,
    required: false,
  },
  itemProps: {
    type: Boolean,
    required: false,
  },
})
const emit = defineEmits(['itemClick'])

const clickItem = (params, value) => {
  emit('itemClick', {params, value})
}
</script>

<template>
  <IconBtn>
    <VIcon icon="mdi-dots-vertical" />
  
    <VMenu
      v-if="props.menuList"
      activator="parent"
    >
      <VList
        density="compact"
      >
        <template v-for="item in props.menuList" :key="item.value">
          <VListItem @click="clickItem(item.params, item.value)" :class="`text-${item.color}`" v-if="!item.hide">
            <template #prepend>
              <VIcon
                :icon="item.prependIcon"
              />
            </template>
            <VListItemTitle>{{ item.title }}</VListItemTitle>
          </VListItem>
        </template>
      </VList>
    </VMenu>
  </IconBtn>
</template>
