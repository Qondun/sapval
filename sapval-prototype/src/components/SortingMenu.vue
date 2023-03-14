<script setup>
    import { computed } from 'vue'
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
    <div id="menuBox">
        <div class="menuItem" :class="{ selectedTab: val==0 }" @click="val=0">
            <p>Översikt regler</p>
        </div>
        <div class="menuItem" :class="{ selectedTab: val==1 }" @click="val=1">
            <p>Kategorier regler</p>
        </div>    
        <div class="menuItem" :class="{ selectedTab: val==2 }" @click="val=2">
            <p>Varningar per allvarighetsgrad</p>
        </div>    
        <div class="menuItem" :class="{ selectedTab: val==3 }" @click="val=3">
            <p>Exempel</p>
        </div>
    </div>
</template>
<style>
    #menuBox {
        display: flex;
        flex-flow: row wrap;
        height: 65%;
        width: 30%;
        justify-content: flex-start;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
        margin-bottom: -2px;
    }
    .menuItem {
        background-color: var(--buttonColor);
        border: var(--generalBorders);
        border-radius: var(--buttonBorderRadius);
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        height: 100%;
        width: 23%;
        color: black;
        text-align: center;
    }
    .menuItem:hover {
        background-color: var(--buttonColorHover);
        color: white;
        cursor: pointer;
    }
    .selectedTab {
        background-color: #cecece; 
        border-bottom: none;
    }
    .selectedTab:hover {
        background-color: #bebebe;
    }
</style>