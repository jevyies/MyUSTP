<script setup>
    import { avatarText } from '@core/utils/formatters'
    const props = defineProps({
    selectedCheckbox: {
        type: Array,
        required: true,
    },
    checkboxContent: {
        type: Array,
        required: true,
    },
    gridColumn: {
        type: null,
        required: false,
    },
    })

    const emit = defineEmits(['update:selectedCheckbox'])

    const selectedOption = ref(structuredClone(toRaw(props.selectedCheckbox)))

    watch(selectedOption, () => {
    emit('update:selectedCheckbox', selectedOption.value)
    })
</script>
<template>
    <VRow
        v-if="props.checkboxContent && selectedOption"
        v-model="selectedOption"
    >
        <VCol
            v-for="item in props.checkboxContent"
            :key="item.title"
            v-bind="gridColumn"
        >
        <VLabel
            class="custom-input custom-checkbox rounded cursor-pointer position-relative w-100"
            :class="selectedOption.includes(item.id) ? 'active' : ''"
        >
            <div class="position-absolute" style="top:0;right:0;">
                <VCheckbox
                    v-model="selectedOption"
                    :value="item.id"
                />
            </div>
            <div class="mb-1">
                <div class="d-flex align-center">
                    <VAvatar
                        size="40"
                        class="avatar-center bg-grey p5"
                        :image="`${item.icon}`"
                        v-if="item.icon"
                    />
                    <VAvatar
                        size="40"
                        class="avatar-center bg-grey p5"
                        v-else
                    >
                        <h2 class="text-primary">{{ avatarText(item.name) }}</h2>
                    </VAvatar>
                    <div class="ms-2 d-flex flex-column">
                        <h6 class="cr-title text-base mb-0">{{ item.name }}</h6>
                        <small v-if="item.url">{{ item.url }}</small>
                    </div>
                </div>
            </div>
        </VLabel>
        </VCol>
    </VRow>
</template>