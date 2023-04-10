<script setup>
import { useActivityLogStore } from '../stores/logger';
const props = defineProps({ modelValue: Number });
const emit = defineEmits(['update:modelValue']);
const activityLog = useActivityLogStore()
</script>

<template>
    <div>
        <br>
        <h1>Admin Page</h1>
        <h2>Put the buttons here</h2>
    </div>
</template>

<style>
#miniMenuBounding {
    width: 250px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 10px;
    right: 10px;
}

.miniMenuButton {
    height: 50px;
    width: auto;
    padding: 6px;
    text-align: center;
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
}

.miniMenuButton:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}
</style>
