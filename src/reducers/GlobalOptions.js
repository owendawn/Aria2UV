import {RpcWSCommand} from "../constants/RpcWSCommand";

const GlobalOptions = (state = {}, action) => {
    switch (action.type){
        case RpcWSCommand.GLOBAL_OPTION_STAT:{
            console.log(action.data)
            return action.data;
        }
        default:
            return state;
    }
};

 export default  GlobalOptions;