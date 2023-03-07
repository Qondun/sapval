<script>

</script>

<template>
    <div id="messages"> <!-- Create specific component for envelopes -->
        Messages
    </div>
    <div id="historyButton" @click="$emit('clickedHistory')">
        <p>Historik</p>
    </div>
</template>

<style>
    #messages, #historyButton {
        height: 80%;
        width: 150px;
        background-color: var(--buttonColor);
        margin: 5px 50px 0 50px;
        border-radius: var(--buttonBorderRadius);
        float: left;
        position: relative;
    } 
    
    #historyButton {
        float: right;
    }

    #messages:hover, #historyButton:hover {
        background-color: var(--buttonColorHover);
        cursor: pointer;
    }
</style>