<script setup>
import { computed } from 'vue';
import { useSelectionDataStore } from '../stores/selectionData'

import { wardsInfo } from '../records/inpatientWards.json';
import { WarningInfo } from '../records/warningList.json';
const props = defineProps({
    layoutState: Number,
    selectionPageState: String,
    selectionStateVal: String
});

const selectionDataStore = useSelectionDataStore()

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
    <div v-if="selectionPageState == 'Ward'" id="wardGrid">
        <div v-for="ward in wardsInfo" :key="ward" class="wardDiv gridButton"
            @click="layoutState = 3, selectionStateVal = ward.KeyNamn">
            <p>Avdelning {{ ward.KeyNamn }} </p>
            <p class="wardTypeText">{{ ward.wardType }}</p>
            <div v-if="ward.WardContactPharmacistFirstName != ''" class="pharmacistDiv">
                <span class="pharmacistTooltip">{{ ward.WardContactPharmacistFirstName + ' ' +
                    ward.WardContactPharmacistLastName }}</span>
            </div>
            <p class="noAlertText"> {{ selectionDataStore.noAlertsForWard(ward.KeyNamn) }} </p>
        </div>
    </div>
    <div v-else-if="selectionPageState == 'Category'" id="categoryGrid">
        <div v-for="(cat, index) in selectionDataStore.getCategoryNames()" :key="index + 1" class="categoryDiv gridButton"
            @click="layoutState = 3, selectionStateVal = index + 1">
            <p>{{ cat }}</p>
            <p class="noAlertText"> {{ selectionDataStore.noAlertsForCategory(index + 1) }}</p>
        </div>
    </div>
    <div v-else id="ruleGrid">
        <div v-for="rule in WarningInfo" :key="rule" class="ruleDiv gridButton"
            @click="layoutState = 3, selectionStateVal = rule.warningNumber">
            <p>Regel {{ rule.warningNumber }}
                <span v-if="0 <= rule.warningNumber && rule.warningNumber <= 9">(RP)</span>
                <span v-else-if="10 <= rule.warningNumber && rule.warningNumber <= 15">(I)</span>
                <span v-else-if="16 <= rule.warningNumber && rule.warningNumber <= 33">(NF)</span>
                <span v-else-if="34 <= rule.warningNumber && rule.warningNumber <= 40">(LÄ)</span>
                <span v-else-if="41 <= rule.warningNumber && rule.warningNumber <= 49">(LL)</span>
                <span v-else-if="50 <= rule.warningNumber && rule.warningNumber <= 51">(LD)</span>
                <span v-else-if="52 <= rule.warningNumber && rule.warningNumber <= 55">(LS)</span>
                <span v-else-if="56 <= rule.warningNumber && rule.warningNumber <= 58">(ÖL)</span>
                <span v-else>(Ö)</span>
            </p>
            <p class="noAlertText"> {{ selectionDataStore.noAlertsForRule(rule.warningNumber) }} </p>
        </div>
    </div>
</template>

<style>
.gridButton {
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    padding: 5px;
    font-size: 100%;
    display: flex;
    flex-direction: column;
}

.gridButton:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}

.gridButton p:first-child {
    font-weight: bold;
    font-size: 107%;
}

.gridButton p:last-child {
    float: right;
    font-size: 130%;
}

.noAlertText {
    position: absolute;
    bottom: 0;
    right: 5px;
}

.wardTypeText {
    margin-top: -9px;
}

#wardGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 5px;
}

.wardDiv {
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
    width: 30%;
    height: 30%;
}

#ruleGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    padding: 4px;
}

.ruleDiv {
    margin: 4px;
}

.pharmacistDiv {
    width: 15px;
    height: 15px;
    background-image: url("./icons/pharmacistIcon.png");
    background-size: 20px 20px;
    position: absolute;
    display: inline-block;
    top: 10px;
    right: 10px;
    z-index: 1;
}

.pharmacistTooltip {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    top: -20px;
    right: 100%;
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

.pharmacistDiv:hover .pharmacistTooltip {
    visibility: visible;
}
</style>