import React,{Component} from 'react'
import {connect} from 'react-redux'
import {
    getUpdateDownloadStats, getUpdateGlobalStat, getUpdateWaitingStats, getUpdateFinishStats,
    getUpdateGlobalOptionStat, getRemoveCommandJob
} from '../actions/RPCWSAction'
import {withRouter} from "react-router-dom";
import {GlobalCommand} from "../constants/GlobalCommand";
import {getSimpleCommonAction} from "../actions/CommonAction";
import {RpcWSCommand} from "../constants/RpcWSCommand";

class RpcWSClient extends Component{
    constructor(props){
        super(props);
        this.state = {
            connected:false,
            debug:false
        }
        this.dispatch=props.dispatch;
    }
    componentDidMount(){
        this.connect();
    }
    connect(){
        this. ws = new WebSocket("ws://localhost:6800/jsonrpc");
        let that=this;
        that.ws.sendraw=that.ws.send;
        this.ws.send=function (str) {
            that.state.debug&&console.log("send:"+str);
            that.ws.sendraw(str);
        }
        this.ws.onopen = ()=> {
            that.setState({connected:true});
            that.ws.onmessage =  (evt)=> {
                let msg = JSON.parse(evt.data);
                that.state.debug&&console.log("receive:",msg)
                this.handleMsg(msg);
            };

            that.ws.onclose = function () {
               that.setState({connected:false})
            };
            that.ws.onerror=that.ws.onclose;

            setInterval(function(){
                that.sendGetGlobalStatREQ();
                if(that.props.global.downloadSwitch)
                    that.sendTellActiveREQ();
                if(that.props.global.waitingSwitch)
                    that.sendTellWaitingREQ();
                if(that.props.global.finishSwitch)
                    that.sendTellStopREQ();
                if(that.props.jobs.length>0)
                    that.props.jobs.forEach(it=>{
                       if(it.data.type===RpcWSCommand.GLOBAL_OPTION_STAT){
                           that.sendGetGlobalOptionREQ();
                           that.dispatch(getRemoveCommandJob(it.data))
                       }else if(it.data.type===RpcWSCommand.UPDATE_GLOBAL_OPTION_STAT){
                           that.sendChangeGlobalOptionREQ(it.data.data);
                           that.dispatch(getRemoveCommandJob(it.data))
                       }
                    });

            },5000);
        };


    }
    disconnect(){
        this.ws.disconnect();
    }
    sendGetGlobalStatREQ(){
        // this.ws.send('{"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_'+new Date().getTime()+'"}');
    }
    sendTellActiveREQ(){
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.tellActive","id":"sendTellActiveREQ_'+new Date().getTime()+'","params":[["gid","totalLength","completedLength","uploadSpeed","downloadSpeed","connections","numSeeders","seeder","status","errorCode","files","bittorrent","dir","bitfield","infoHash","numPieces"]]}')
    }
    sendTellWaitingREQ(){
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.tellWaiting","id":"sendTellWaitingREQ_'+new Date().getTime()+'","params":[0,1000,["gid","totalLength","completedLength","uploadSpeed","downloadSpeed","connections","numSeeders","seeder","status","errorCode","files","bittorrent","dir","bitfield","infoHash","numPieces"]]}')
    }
    sendTellStopREQ(){
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.tellStopped","id":"sendTellStopREQ_'+new Date().getTime()+'","params":[-1,1000,["gid","totalLength","completedLength","uploadSpeed","downloadSpeed","connections","numSeeders","seeder","status","errorCode","files","bittorrent","dir","bitfield","infoHash","numPieces"]]}')
    }
    sendGetGlobalOptionREQ(){
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.getGlobalOption","id":"sendGetGlobalOptionREQ_'+new Date().getTime()+'"}')
    }
    sendChangeGlobalOptionREQ(data){
        let str="";
        for (let k in data){
            str+='"'+k+'":"'+data[k]+'",';
        }
        str=str.substr(0,str.length-1);
        str='[{'+str+'}]';
        console.log(str)
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.changeGlobalOption","id":"sendChangeGlobalOptionREQ_'+new Date().getTime()+'","params":'+str+'}')
    }

    handleMsg(result){
        if(result.id.indexOf("sendGetGlobalStatREQ_")>=0){
            this.dispatch(getUpdateGlobalStat(result.result));
        }else if(result.id.indexOf("sendTellActiveREQ_")>=0){
            this.dispatch(getUpdateDownloadStats(result.result))
        }else if(result.id.indexOf("sendTellWaitingREQ_")>=0){
            this.dispatch(getUpdateWaitingStats(result.result))
        }else if(result.id.indexOf("sendTellStopREQ_")>=0){
            this.dispatch(getUpdateFinishStats(result.result))
        }else if(result.id.indexOf("sendGetGlobalOptionREQ_")>=0){
            this.dispatch(getUpdateGlobalOptionStat(result.result))
        }
    }

    render(){
        return(
            <i className={["fa fa-heartbeat",this.state.connected?"text-light":"text-danger"].join(" ")}> </i>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        global: state.Global,
        jobs:state.CommandJobs
    }
};

export default withRouter(connect(mapStateToProps)(RpcWSClient));