<script setup>
    //const dynamicBot = defineProps(['state'])
    let lastSelectedTab = 0;
    let tabSelectArr = [true, false, false, false];
    function updateSelectedTab(tabNum){
        //if(tabNum != lastSelectedTab) {
            this.tabSelectArr[lastSelectedTab] = false;
            this.tabSelectArr[tabNum] = true;
            this.lastSelectedTab = tabNum;
        //}
    }
</script>
<template>
    <div id="menuBox">
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[0] }" @click="$emit('clickedMenu',0), updateSelectedTab(0)">
            <p>Översikt regler</p>
        </div>
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[1] }" @click="$emit('clickedMenu',1), updateSelectedTab(1)">
            <p>Kategorier regler</p>
        </div>    
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[2] }" @click="$emit('clickedMenu',2), updateSelectedTab(2)">
            <p>Varningar per allvarighetsgrad</p>
        </div>    
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[3] }" @click="$emit('clickedMenu',3), updateSelectedTab(3)">

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