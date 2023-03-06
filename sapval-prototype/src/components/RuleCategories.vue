<script>
</script>

<template>
    <div id="categoryGrid">
        <div class="categoryDiv">
            <p>Riskprofil</p>
        </div>
        <div class="categoryDiv">
            <p>Interaktioner</p>
        </div>
        <div class="categoryDiv">
            <p>Njurfunktion</p>
        </div>
        <div class="categoryDiv">
            <p>Läkemedel och äldre</p>
        </div>
        <div class="categoryDiv">
            <p>Läkemedel och labvärden</p>
        </div>
        <div class="categoryDiv">
            <p>Läkemedel och diagnos</p>
        </div>
        <div class="categoryDiv">
            <p>Läkemedel och status</p>
        </div>
        <div class="categoryDiv">
            <p>Övriga läkemedelskombinationer</p>
        </div>
        <div class="categoryDiv">
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
    background-color: #aeaeae;
    width: 30%;
    height: 30%;
    border-radius: var(--buttonBorderRadius);
}

.categoryDiv:hover {
    background-color: #999;
    cursor: pointer;
}
</style>