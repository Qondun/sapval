<script setup>
import { computed } from 'vue';
const props = defineProps({ modelValue: Number });
const emit = defineEmits(['update:modelValue']);

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
    <div id="miniMenuBounding">
        <!-- <div id="messages" class="miniMenuButton" @click="val = 0"> 
            <p>Meddelanden</p>
        </div>
        <div v-if="val == 1" id="closeButton" class="miniMenuButton" @click="val = 0">
            <p>Stäng historik</p>
        </div>
        <div v-if="val != 1" id="historyButton" class="miniMenuButton" @click="val = 1">
            <p>Historik</p>
        </div> -->
        <div v-if="val == 99" id="adminCloseButton" class="miniMenuButton" @click="val = 0">
            <p>Stäng Admin</p>
        </div>
        <div v-if="val != 99" id="adminButton" class="miniMenuButton" @click="val = 99">
            <p>Admin</p>
        </div>
    </div>
</template>

<style>
#miniMenuBounding {
    width: 250px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
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