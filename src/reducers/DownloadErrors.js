import {RpcWSCommand} from "../constants/RpcWSCommand";

const DownloadErrors = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.Add_DOWNLOAD_ERROR:{
            return [...state,action.data];
        }
        case RpcWSCommand.REMOVE_DOWNLOAD_ERROR:{
            return state.filter(it=>it.id!==action.data.id);
        }
        default:
            return state;
    }
};

export default  DownloadErrors;