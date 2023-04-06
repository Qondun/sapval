<script setup>
    import { computed } from 'vue';
    import { getCategoryData } from '../records/dataFunctions';
    import { wardsInfo } from '../records/wards.json'
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
    <div v-if="selectionPageState=='Ward'" id="wardGrid">
        <div v-for="ward in wardsInfo" :key="ward" class="wardDiv gridButton">
            <p>Avdelning {{ ward.Avdelning }}</p>
        </div>
    </div>
    <div v-else-if="selectionPageState=='Category'" id="categoryGrid">
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=1 ">
            <p>Riskprofil {{ getCategoryData([1,9])[1].reduce((count, current) => count + current.length, 0) }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=2">
            <p>Interaktioner {{ getCategoryData([10,15])[1].reduce((count, current) => count + current.length, 0) }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=3">
            <p>Njurfunktion {{ getCategoryData([16,33])[1].length }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=4">
            <p>Läkemedel och äldre {{ getCategoryData([34,30])[1].reduce((count, current) => count + current.length, 0) }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=5">
            <p>Läkemedel och labvärden {{ getCategoryData([41,49])[1].reduce((count, current) => count + current.length, 0) }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=6">
            <p>Läkemedel och diagnos {{ getCategoryData([50,51])[1].length }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=7">
            <p>Läkemedel och status {{ getCategoryData([52,55])[1].length }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=8">
            <p>Övriga läkemedelskombinationer {{ getCategoryData([56,58])[1].length }}</p>
        </div>
        <div class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=9">
            <p>Övrigt {{ getCategoryData([59,63])[1].length }}</p>
        </div>
    </div>
    <div v-else id="ruleGrid">
        <div v-for="ruleNum in 63" :key="ruleNum" class="ruleDiv gridButton">
            <p>Regel {{ ruleNum }}</p>
        </div>
    </div>
</template>

<style>
.gridButton:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}

#wardGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 5px;
}

.wardDiv {
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    margin: 5px;
}

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

#ruleGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    padding: 5px;
}

.ruleDiv {
    /* width: 9%;
    height: 45px; */
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    margin: 5px;
}


</style>