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
    <div id="categoryGrid">
        <div class="categoryDiv" @click="val=3">
            <p>Riskprofil</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Interaktioner</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Njurfunktion</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Läkemedel och äldre</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Läkemedel och labvärden</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Läkemedel och diagnos</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Läkemedel och status</p>
        </div>
        <div class="categoryDiv" @click="val=3">
            <p>Övriga läkemedelskombinationer</p>
        </div>
        <div class="categoryDiv" @click="val=3">
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