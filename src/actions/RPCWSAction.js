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

export const getUpdateGlobalOptionStat=(state)=>{
    return{
        type:RpcWSCommand.GLOBAL_OPTION_STAT,
        data:state
    };
};

export const getRemoveCommandJob=(state)=>{
    return{
        type:RpcWSCommand.ROMOVE_COMMAND_JOB,
        data:state
    }
}

export const getAddCommandJob=(state)=>{
    return{
        type:RpcWSCommand.ADD_COMMAND_JOB,
        data:state
    }
}


export const getAddURL=(data,params)=>{
    return {
        type:RpcWSCommand.ADD_URL,
        data:data,
        params:params
    }
}

export const getAddTorrent=(data,params)=>{
    return {
        type:RpcWSCommand.ADD_TORRENT,
        data:data,
        params:params
    }
}

export const getAddMetalink=(data,params)=>{
    return {
        type:RpcWSCommand.ADD_METALINK,
        data:data,
        params:params
    }
}

