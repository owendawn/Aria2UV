import {RpcWSCommand} from "../constants/RpcWSCommand";

const Finishs = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.FINISH_DOWNLOAD_STATS:{
            return action.data;
        }
        default:
            return state;
    }
};

 export default  Finishs;