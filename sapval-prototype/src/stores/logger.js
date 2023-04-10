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
            if (this.initialized) {
                console.log("already initialized")
                return
            }
            console.log("initializing the data")
            this.initialized = true

        },

        logAppend(item) {
            const data = {
                time: Date.now(),
                item: item,
                type: 'JennType'
            };

            this.activityLog.push(data)

        },

        logDump() {
            const data = JSON.stringify(this.activityLog);
            return new Blob([data], { type: 'text/plain' });
        },

        logConsole() {
            const data = JSON.stringify(this.activityLog);
            //new Blob([data], { type: 'text/plain' }); 
            console.log(data)
        },

        logReset() {
            this.activityLog = []

        }



    },
},
)