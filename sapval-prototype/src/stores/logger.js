import { defineStore } from 'pinia'
import { useLocalStorage } from "@vueuse/core"


export const useActivityLogStore = defineStore('activityLog', {
    state: () => ({
        initialized: false,
        activityLog: useLocalStorage('activityLog', []),
    }),
    getters: {
        getLogData: (state) => state.activityLog,
    },
    actions: {
        initialize() {
            this.activityLog = []
        },

        logAppend(item) {
            const data = {
                time: Date(),
                item: item
            };

            this.activityLog.push(data)

        },

        logDump() {
            const data = JSON.stringify(this.activityLog, null, 2);
            return new Blob([data], { type: 'text/plain' });
        },

        logConsole() {
            const data = JSON.stringify(this.activityLog, null, 2);
            //new Blob([data], { type: 'text/plain' }); 
            console.log(data)
        },

        logReset() {
            this.activityLog = []

        }



    },
},
)