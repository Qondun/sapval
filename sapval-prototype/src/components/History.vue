<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useActivityLogStore } from '../stores/logger';
const props = defineProps({ modelValue: Number });
const emit = defineEmits(['update:modelValue']);

const activityLog = useActivityLogStore()
activityLog.initialize()
const activityLogRef = storeToRefs(activityLog)

const val = computed({
    get() {
        return props.modelValue;
    },
    set(newVal) {
        emit('update:modelValue', parseInt(newVal));
    },
});
</script>

<template>
    <div>
        <H1>Activity Log</H1>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Event</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in activityLog.activityLog">
                    <td>{{ Date(item.time) }}</td>
                    <td>{{ item.item }}</td>
                </tr>
            </tbody>
        </table>
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
