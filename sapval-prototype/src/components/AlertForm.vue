<script>
import { defineProps, onMounted } from 'vue';

let formState = 0;
const currentAlert = defineProps(['alert'])

</script>
<template>
    <div id="formBoundingBox">
        <div id="formTabBox">
            <div class="formTab" :class="{ selectedTab: formState == 0 }" onclick="formState=0">
                <p>Avvisa</p>
            </div>
            <div class="formTab" :class="{ selectedTab: formState == 1 }" onclick="formState=1">
                <p>OK (skicka varning)</p>
            </div>
            <div class="formTab" :class="{ selectedTab: formState == 2 }" onclick="formState=2">
                <p>Behåll för framtida bedömning</p>
            </div>
        </div>
        <div v-if="true">
            <p>Avvisa</p>
        </div>
        <div v-else-if="false">
            <p>Skicka</p>
        </div>
    </div>
</template>
<style>
#formBoundingBox {
    display: flex;
    flex-direction: column;
    width: 95%;
}

#formTabBox {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.formTab {
    border: var(--generalBorders);
    border-radius: var(--buttonBorderRadius);
}
</style>