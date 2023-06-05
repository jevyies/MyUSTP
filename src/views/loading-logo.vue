<script setup>
    const props = defineProps({
        width: {
            type: Number,
            default: 86,
        },
        height: {
            type: Number,
            default: 46,
        },
        smallLoading: {
            type: Boolean,
            default: false
        }
    })
</script>
<template>
  <div class="loading-logo" :class="{'small-logo': props.smallLoading}">
    <svg :width="props.width" :height="props.height" viewBox="0 0 268 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="50.289" height="143.953" rx="25.144" transform="matrix(-.8652 .50142 .49859 .86684 195.571 0)"
            fill="rgb(var(--v-theme-primary)" />
        <rect width="50.289" height="143.953" rx="25.144" transform="matrix(-.8652 .50142 .49859 .86684 196.084 0)"
            fill="url(#a)" fill-opacity=".4" />
        <rect width="50.289" height="143.953" rx="25.144" transform="rotate(30.094 86.573 322.042) skewX(.187)"
            fill="rgb(var(--v-theme-primary)" />
        <rect width="50.289" height="143.953" rx="25.144" transform="matrix(-.8652 .50142 .49859 .86684 94.197 0)"
            fill="rgb(var(--v-theme-primary)" />
        <rect width="50.289" height="143.953" rx="25.144" transform="matrix(-.8652 .50142 .49859 .86684 94.197 0)"
            fill="url(#b)" fill-opacity=".4" />
        <rect width="50.289" height="143.953" rx="25.144" transform="rotate(30.094 35.886 133.493) skewX(.187)"
            fill="rgb(var(--v-theme-primary)" />
        <defs>
            <linearGradient id="a" x1="25.144" y1="0" x2="25.144" y2="143.953" gradientUnits="userSpaceOnUse">
            <stop />
            <stop offset="1" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="b" x1="25.144" y1="0" x2="25.144" y2="143.953" gradientUnits="userSpaceOnUse">
            <stop />
            <stop offset="1" stop-opacity="0" />
            </linearGradient>
        </defs>
    </svg>
</div>
<div class="loading" :class="{'small-loading': props.smallLoading}">
    <div class="effect-1 effects"></div>
    <div class="effect-2 effects"></div>
    <div class="effect-3 effects"></div>
</div>
</template>
