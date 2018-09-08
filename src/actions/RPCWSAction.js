import {RpcWSCommand} from '../constants/RpcWSCommand'
export const getUpdateGlobalStat=(state)=>{
    return{
        type:RpcWSCommand.GLOBAL_STAT,
        data:state
    };
};

export const getUpdateDownloadStats=(state)=>{
    return{
        type:RpcWSCommand.DOWNLOAD_STATS,
        data:state
    };
};