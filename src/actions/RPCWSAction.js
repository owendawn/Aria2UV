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

export const getUpdateWaitingStats=(state)=>{
    return{
        type:RpcWSCommand.WAIT_DOWNLOAD_STATS,
        data:state
    };
};

export const getUpdateFinishStats=(state)=>{
    return{
        type:RpcWSCommand.FINISH_DOWNLOAD_STATS,
        data:state
    };
};