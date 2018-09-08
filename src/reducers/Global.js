import {GlobalCommand} from '../constants/GlobalCommand'
const Global = (state = {
        "downloadSpeed": "--",
        "numActive": "--",
        "numStopped": "--",
        "numStoppedTotal": "--",
        "numWaiting": "--",
        "uploadSpeed": "--",

        downloadSwitch:false
    }, action) => {
        switch (action.type) {
            case GlobalCommand.GLOBAL_STAT: {
                return Object.assign(state,action.data);
            }
            case GlobalCommand.OPEN_DOWNLOAD:{
                return Object.assign(state,{downloadSwitch:true});
            }
            case GlobalCommand.CLOSE_DOWNLOAD:{
                return Object.assign(state,{downloadSwitch:false});
            }
            default:
                return state;
        }
    }
;
export default Global