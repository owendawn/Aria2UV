import {GlobalCommand} from "../constants/GlobalCommand";

export const Aria2Link=(state={
    ip:'localhost',
    port:6800,
    reconnect:false,
    status:500
}, action)=>{
    switch (action.type){
        case GlobalCommand.RECONNECT:{
            return Object.assign({},state,action.data,{reconnect:true});
        }
        case GlobalCommand.FINISH_RECONNECT:{
            return Object.assign({},state,action.data,{reconnect:false});
        }
        default:
            return state;
    }
}