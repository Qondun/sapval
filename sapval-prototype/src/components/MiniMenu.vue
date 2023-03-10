<script setup>
    let historyState = false;
    
    function changeState() {
        historyState = !historyState
    }
</script>

<template>
    <div id="miniMenuBounding">
        <div id="messages" class="miniMenuButton"> <!-- Create specific component for envelopes -->
            Messages
        </div>
        <div v-if="!historyState" id="historyButton" class="miniMenuButton" @click="$emit('clickedHistory'), changeState()">
            <p>Historik</p>
        </div>
        <div v-else id="closeButton" class="miniMenuButton" @click="$emit('clickedHistory'), changeState()"> 
            <p>Stäng historik</p>
        </div>
    </div>
</template>

<style>
    #miniMenuBounding {
        width: 200px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .miniMenuButton {
        height: 50px;
        width: auto;
        padding: 6px;
        text-align: center;
        background-color: var(--buttonColor);
        border-radius: var(--buttonBorderRadius);
    } 

    .miniMenuButton:hover {
        background-color: var(--buttonColorHover);
        cursor: pointer;
    }
    
</style>