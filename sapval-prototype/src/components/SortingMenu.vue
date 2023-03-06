<script setup>
    //const dynamicBot = defineProps(['state'])
    let lastSelectedTab = 1;
    let tabSelectArr = [true, false, false, false];
    function updateSelectedTab(tabNum){
        if(tabNum != lastSelectedTab) {
            this.tabSelectArr[lastSelectedTab] = false;
            this.tabSelectArr[tabNum] = true;
            this.lastSelectedTab = tabNum;
        }
    }
</script>
<template>
    <div id="menuBox">
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[1] }" @click="$emit('clickedMenu',1), updateSelectedTab(1)">
            <p>Översikt regler</p>
        </div>
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[2] }" @click="$emit('clickedMenu',2), updateSelectedTab(2)">
            <p>Kategorier regler</p>
        </div>    
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[3] }" @click="$emit('clickedMenu',3), updateSelectedTab(3)">

        </div>    
        <div class="menuItem" :class="{ selectedTab: tabSelectArr[4] }" @click="$emit('clickedMenu',4), updateSelectedTab(4)">

        </div>    
    </div>
</template>
<style>
    #menuBox {
        vertical-align: bottom;
        display: flex;
        flex-flow: row wrap;
        height: 60%;
        width: 30%;
        justify-content: flex-start;
        position: absolute;
        bottom: 0;
        right: 0;
    }
    .menuItem {
        background-color: #eeeeee;
        border: 2px solid;
        border-radius: var(--buttonBorderRadius);
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        border-color: black;
        height: 100%;
        width: 20%;
        color: black;
        text-align: center;
    }
    .menuItem:hover {
        background-color: #999;
        color: white;
        cursor: pointer;
    }
    .selectedTab {
        background-color: #a1a1a1; 
        border-bottom: none;
    }
</style>