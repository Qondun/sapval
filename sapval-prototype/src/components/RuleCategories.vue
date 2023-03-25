<script setup>
    import { computed } from 'vue';
    const props = defineProps({ 
        layoutState: Number,
        selectionPageState: String,
        selectionStateVal: String 
    });
    const emit = defineEmits(['update:layoutState', 'update:selectionPageState', 'update:selectionStateVal']);

    const layoutState = computed({
        get() {
            return props.layoutState;
        },
        set(newVal) {
            emit('update:layoutState', parseInt(newVal));
        },
    });

    const selectionPageState = computed({
        get() {
            return props.selectionPageState;
        },
        set(newVal) {
            emit('update:selectionPageState', (newVal));
        },
    });
    
    const selectionStateVal = computed({
        get() {
            return props.selectionStateVal;
        },
        set(newVal) {
            emit('update:selectionStateVal', (newVal));
        },
    });
</script>

<template>
    <div id="categoryGrid">
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='A. Riskprofil' ">
            <p>Riskprofil</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='B. Interaktioner'">
            <p>Interaktioner</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='C. Njurfunktion'">
            <p>Njurfunktion</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='D. Läkemedel och äldre'">
            <p>Läkemedel och äldre</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='E. Läkemedel och labvärden'">
            <p>Läkemedel och labvärden</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='F. Läkemedel och diagnos'">
            <p>Läkemedel och diagnos</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='G. Läkemedel och status'">
            <p>Läkemedel och status</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='H. Övriga läkemedelskombinationer'">
            <p>Övriga läkemedelskombinationer</p>
        </div>
        <div class="categoryDiv" @click="layoutState=3, selectionPageState='Category', selectionStateVal='I. Övrigt'">
            <p>Övrigt</p>
        </div>
    </div>
</template>

<style>
#categoryGrid {
    width: 90%;
    height: 90%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
}

.categoryDiv {
    background-color: var(--buttonColor);
    width: 30%;
    height: 30%;
    border-radius: var(--buttonBorderRadius);
}

.categoryDiv:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}
</style>