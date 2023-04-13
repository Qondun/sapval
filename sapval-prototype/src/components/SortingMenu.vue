<script setup>
    import { computed } from 'vue'
    const props = defineProps({ dynamicBotState: Number, selectionPageState: String });
    const emit = defineEmits(['update:dynamicBotState', 'update:selectionPageState']);

    const state = computed({
        get() {
            return props.dynamicBotState;
        },
        set(newState) {
            emit('update:dynamicBotState', parseInt(newState));
        },
    });
    const pageState = computed({
        get() {
            return props.selectionPageState;
        },
        set(newState) {
            emit('update:selectionPageState', newState);
        },
    });
</script>
<template>
    <div id="menuBox">
        <div class="menuItem" :class="{ selectedTab: pageState=='Ward' }" @click="pageState='Ward'">
            <p>Avdelningar</p>
        </div> 
        <!-- <div class="menuItem" :class="{ selectedTab: pageState=='Category' }" @click="pageState='Category'">
            <p>Kategorier</p>
        </div>  -->
        <div class="menuItem" :class="{ selectedTab: pageState=='Rule' || pageState=='Category' }" @click="pageState='Rule' ">
            <p>Regler</p>
        </div>
    </div>
</template>
<style>
    #menuBox {
        display: flex;
        flex-flow: row wrap;
        height: 65%;
        width: 30%;
        justify-content: flex-end;
        position: absolute;
        bottom: 0;
        right: 10px;
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
        cursor: pointer;
    }
    .selectedTab {
        background-color: var(--buttonSelected); 
        border-bottom: none;
    }
    .selectedTab:hover {
        background-color: var(--buttonSelectedHover);
    }
</style>