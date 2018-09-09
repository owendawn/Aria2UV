import {RpcWSCommand} from "../constants/RpcWSCommand";

const Waitings = (state = [], action) => {
    switch (action.type){
        case RpcWSCommand.WAIT_DOWNLOAD_STATS:{
            return action.data;
        }
        default:
            return state;
    }
};

 export default  Waitings;