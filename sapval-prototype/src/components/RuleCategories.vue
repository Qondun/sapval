<script setup>
import { computed, watch, onMounted, nextTick } from 'vue';
import { useSelectionDataStore } from '../stores/selectionData'
import { storeToRefs } from 'pinia'

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

const selectionData = useSelectionDataStore()
const categoryNames = selectionData.getCategoryNames()

const { updated } = storeToRefs(selectionData)

watch(updated, () => {
    createRuleBottom();
})
onMounted(() => { // TODO: Find way to create different layouts. Easiest way is to do seperate components
    console.log("in ruleCategories")
    createRuleBottom();    
})

function createRuleBottom() {
    let ruleGrid = document.getElementById("ruleGrid");
    let catNames = selectionDataStore.getCategoryNames();
    for(var cat in catNames) {
        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('categoryDiv');
        categoryDiv.classList.add('gridButton');
        categoryDiv.setAttribute('id',parseInt(cat)+1)
        
        let categoryText = document.createElement('p');
        if(catNames[cat]!="Övriga läkemedelskombinationer") {
            categoryText.innerHTML = catNames[cat];
        } else {
            categoryText.innerHTML = "Övriga läkemedels- <br>kombinationer";
        }
        categoryDiv.appendChild(categoryText);
        
        let categoryCount = document.createElement('p');
        categoryCount.innerHTML = selectionDataStore.noAlertsForCategory(parseInt(cat)+1);
        categoryDiv.appendChild(categoryCount);

        categoryDiv.addEventListener('click', function() {
            layoutState.value = 3;
            selectionPageState.value = "Category";
            selectionStateVal.value = categoryDiv.id;
            console.log("selectionPageState: " + selectionPageState.value);
        });

        ruleGrid.appendChild(categoryDiv);

        let ruleRange = selectionDataStore.getCategoryRange(parseInt(cat)+1)
        for(var i=ruleRange[0]; i<=ruleRange[1]; i++) {
            let ruleDiv = document.createElement('div');
            ruleDiv.classList.add('ruleDiv');
            ruleDiv.classList.add('gridButton');
            ruleDiv.setAttribute('id',i);

            let ruleText = document.createElement('p');
            ruleText.innerHTML = i;
            ruleDiv.appendChild(ruleText);

            let ruleCountText = document.createElement('p');
            ruleCountText.innerHTML = selectionDataStore.noAlertsForRule(i);
            ruleDiv.appendChild(ruleCountText);

            ruleDiv.addEventListener('click', function() {
                layoutState.value = 3;
                selectionPageState.value = "Rule";
                selectionStateVal.value = ruleDiv.id;
            });

            ruleGrid.appendChild(ruleDiv);
        }
    }
}
</script>

<template>
    <div id="ruleGrid">
        <!-- <template v-for="(cat, index) in selectionDataStore.getCategoryNames()" :key="index+1">
            <div class="categoryDiv gridButton" @click="layoutState=3, selectionPageState='Category', selectionStateVal=index+1">
                <p v-if="cat!='Övriga läkemedelskombinationer'">{{ cat }}</p>
                <p v-else>Övriga läkemedels- <br> kombinationer</p>
                <p> {{ selectionDataStore.noAlertsForCategory(index + 1) }}</p>
            </div>
            <div v-for="rule in selectionDataStore.getRuleNumbers().slice(selectionDataStore.getCategoryRange(index+1)[0]-1, selectionDataStore.getCategoryRange(index+1)[1])" :key="rule" class="ruleDiv gridButton"
                @click="layoutState = 3, selectionPageState='Rule', selectionStateVal = rule">
                <p>Regel {{ rule }}</p>
                <p> {{ selectionDataStore.noAlertsForRule(rule) }} </p>
            </div>
        </template> -->
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

#wardGrid .gridButton {
    display: flex;
    flex-direction: column;
}

.wardDiv {
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
    right: 100%;
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}
.pharmacistDiv:hover .pharmacistTooltip {
    visibility: visible;
}


#ruleGrid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    padding: 10px;
    overflow: auto;
    column-gap: 10px; 
}
.categoryDiv, .ruleDiv {
    width: 200px;
}

.categoryDiv {
    font-size: 105%;
    text-decoration: underline;
    position: relative;
    top: 0;
    border: var(--generalBorders)
}

.categoryDiv p, .ruleDiv p {
    display: inline;
}
.categoryDiv p:first-child {
    margin-right: 10px;
}

.ruleDiv {
    margin-top: 4px;
    font-weight: normal;
}

</style>