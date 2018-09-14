import {RpcWSCommand} from "../constants/RpcWSCommand";

const CommandJobs = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.ADD_COMMAND_JOB:{
            return [ ...state,action];
        }
        case RpcWSCommand.ROMOVE_COMMAND_JOB:{
            return state.filter(it=>(it.data.type!==action.data.type));
        }
        default:
            return state;
    }
};

export default  CommandJobs;