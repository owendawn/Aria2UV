import {RpcWSCommand} from "../constants/RpcWSCommand";

const Downloads = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.DOWNLOAD_STATS:{
            return action.data;
        }
        default:
            return state;
    }
};

 export default  Downloads;