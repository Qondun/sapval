<script setup>
    import { computed } from 'vue';
    import { noAlertsForWard, noAlertsForCategory, noAlertsForRule, getCategoryNames } from '../records/dataFunctions';
    import { wardsInfo } from '../records/inpatientWards.json';
    import { WarningInfo } from '../records/warningList.json';
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
        <div v-for="ward in wardsInfo" :key="ward" class="wardDiv gridButton" @click="layoutState=3, selectionStateVal=ward.KeyNamn">
            <p>Avdelning {{ ward.KeyNamn }}</p>
            <div v-if="ward.WardContactPharmacistFirstName!=''" class="pharmacistDiv">
                <span class="pharmacistTooltip">{{ ward.WardContactPharmacistFirstName + ' ' + ward.WardContactPharmacistLastName }}</span>
            </div>
            <p> Antal varningar: {{ noAlertsForWard(ward.KeyNamn) }} </p>
        </div>
    </div>
    <div v-else-if="selectionPageState=='Category'" id="categoryGrid">
        <div v-for="(cat, index) in getCategoryNames()" :key="index+1" class="categoryDiv gridButton" @click="layoutState=3, selectionStateVal=index+1 ">
            <p>{{ cat }}</p>
            <p>Antal varningar: {{ noAlertsForCategory(index+1) }}</p>
        </div>
    </div>
    <div v-else id="ruleGrid">
        <div v-for="rule in WarningInfo" :key="rule" class="ruleDiv gridButton" @click="layoutState=3, selectionStateVal=rule.warningNumber">
            <p>Regel {{ rule.warningNumber }}</p>
            <p> Antal varningar: {{ noAlertsForRule(rule.warningNumber) }} </p>
        </div>
    </div>
</template>

<style>
.gridButton {
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    padding: 5px;
    font-size: 100%;
}
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
    padding: 5px;
}

.ruleDiv {
    margin: 5px;
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
    right: 105%;
      /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

.pharmacistDiv:hover .pharmacistTooltip {
    visibility: visible;
}

</style>