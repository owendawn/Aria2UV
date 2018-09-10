import {RpcWSCommand} from "../constants/RpcWSCommand";

const CommandJobs = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.ADD_COMMAND_JOB:{
            return [ ...state,action];
        }
        case RpcWSCommand.ROMOVE_COMMAND_JOB:{
            return state.filter(it=>(it.data!==action.data));
        }
        default:
            return state;
    }
};

export default  CommandJobs;