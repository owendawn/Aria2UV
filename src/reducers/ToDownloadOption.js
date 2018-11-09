
import {RpcWSCommand} from "../constants/RpcWSCommand";

const ToDownloadOption = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.ADD_GET_TODO_OPTION:{
            return [ ...state,action.data];
        }
        case RpcWSCommand.REMOVE_GET_TODO_OPTION:{
            return state.filter(it=>(it.id!==action.id));
        }
        default:
            return state;
    }
};

export default  ToDownloadOption;