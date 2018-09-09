import {GlobalCommand} from '../constants/GlobalCommand'
const Global = (state = {
        "downloadSpeed": "--",
        "numActive": "--",
        "numStopped": "--",
        "numStoppedTotal": "--",
        "numWaiting": "--",
        "uploadSpeed": "--",

        downloadSwitch:false,
        waitingSwitch:false,
        finishSwitch:false
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
            case GlobalCommand.OPEN_WAIT_DOWNLOAD:{
                return Object.assign(state,{waitingSwitch:true});
            }
            case GlobalCommand.CLOSE_WAIT_DOWNLOAD:{
                return Object.assign(state,{waitingSwitch:false});
            }
            case GlobalCommand.OPEN_FINISH_DOWNLOAD:{
                return Object.assign(state,{finishSwitch:true});
            }
            case GlobalCommand.CLOSE_FINISH_DOWNLOAD:{
                return Object.assign(state,{finishSwitch:false});
            }
            default:
                return state;
        }
    }
;
export default Global