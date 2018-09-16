import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    getUpdateDownloadStats, getUpdateGlobalStat, getUpdateWaitingStats, getUpdateFinishStats,
    getUpdateGlobalOptionStat, getRemoveCommandJob
} from '../actions/RPCWSAction'
import {withRouter} from "react-router-dom";
import {GlobalCommand} from "../constants/GlobalCommand";
import {getBaseCommonAction, getSimpleCommonAction} from "../actions/CommonAction";
import {RpcWSCommand} from "../constants/RpcWSCommand";
import {PanUtil} from "../util/PanUtil";
import {errotPng, infoJpg} from "../image/base64img";

class RpcWSClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            debug: false,
        }
        this.dispatch = props.dispatch;
    }

    componentDidMount() {
        this.connects();
    }

    componentDidUpdate() {
        if(this.props.Aria2Link.reconnect){
            if(this.ws){
                this.ws.close();
                let that=this;
                (function _reConn() {
                    if (that.ws.readyState===that.ws.CLOSED){
                        that.connects();
                    }else{
                        setTimeout(_reConn,1000)
                    }
                })();

            }else {
                this.connects();
            }
        }
    }

    finishConnect(code){
        this.props.dispatch(getBaseCommonAction(GlobalCommand.FINISH_RECONNECT,{status:code}));
    }
    getSize(size){
        if(isNaN(Number(size))){
            return ' -- ';
        }
        if(size>1024*1024*1024) {
            return Math.round(size * 100 / 1024 / 1024/1024) / 100 + "G/s";
        }else if(size>1024*1024){
            return Math.round(size*100/1024/1024 )/100+"M/s";
        }else if(size>1024){
            return Math.round(size*100/1024 )/100+"K/s";
        }else{
            return size+"B/s";
        }
    }
    connects() {
        this.ws = new WebSocket("ws://"+this.props.Aria2Link.ip+":"+this.props.Aria2Link.port+"/jsonrpc");
        let that = this;
        that.ws.sendraw = that.ws.send;
        this.ws.send = function (str) {
            that.state.debug && console.log("send:" + str);
            that.ws.sendraw(str);
        }
        this.ws.onclose = function () {
            that.setState({connected: false})
            that.finishConnect(200)
        };
        this.ws.onerror = function () {
            that.setState({connected: false})
            that.finishConnect(500)
        };
        this.ws.onopen = () => {
            that.setState({connected: true});
            that.ws.onmessage = (evt) => {
                let msg = JSON.parse(evt.data);
                that.state.debug && console.log("receive:", msg)
                this.handleMsg(msg);
            };



            setInterval(function () {
                if(!that.state.connected){
                    return;
                }
                that.sendGetGlobalStatREQ();
                if (that.props.Global.downloadSwitch)
                    that.sendTellActiveREQ();
                if (that.props.Global.waitingSwitch)
                    that.sendTellWaitingREQ();
                if (that.props.Global.finishSwitch)
                    that.sendTellStopREQ();
                if (that.props.CommandJobs.length > 0)
                    that.props.CommandJobs.forEach(it => {
                        if (it.data.type === RpcWSCommand.GLOBAL_OPTION_STAT) {
                            that.sendGetGlobalOptionREQ();
                        } else if (it.data.type === RpcWSCommand.UPDATE_GLOBAL_OPTION_STAT) {
                            that.sendChangeGlobalOptionREQ(it.data.data);
                        } else if (it.data.type === RpcWSCommand.ADD_URL) {
                            that.sendAddUriREQ(it.data.data, it.data.params);
                        } else if (it.data.type === RpcWSCommand.ADD_TORRENT) {
                            that.sendAddTorrentREQ(it.data.data, it.data.params);
                        } else if (it.data.type === RpcWSCommand.ADD_METALINK) {
                            that.sendAddMetalinkREQ(it.data.data, it.data.params);
                        } else if (it.data.type === RpcWSCommand.FORCE_REMOVE) {
                            that.sendForceRemoveREQ(it.data.data);
                        } else if (it.data.type === RpcWSCommand.REMOVE_DOWNLOAD_RESULT) {
                            that.sendRemoveDownloadResultREQ(it.data.data);
                        } else if (it.data.type === RpcWSCommand.PAUSE) {
                            that.sendPauseREQ(it.data.data);
                        } else if (it.data.type === RpcWSCommand.UNPAUSE) {
                            that.sendUnpauseREQ(it.data.data);
                        }
                        that.dispatch(getRemoveCommandJob(it.data))
                    });

            }, 1000);
        };


    }

    disconnect() {
        this.ws.disconnect();
    }

    sendGetGlobalStatREQ() {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.getGlobalStat","id":"sendGetGlobalStatREQ_' + new Date().getTime() + '"}');
    }

    sendTellActiveREQ() {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.tellActive","id":"sendTellActiveREQ_' + new Date().getTime() + '","params":[["gid","totalLength","completedLength","uploadSpeed","downloadSpeed","connections","numSeeders","seeder","status","errorCode","files","bittorrent","dir","bitfield","infoHash","numPieces"]]}')
    }

    sendTellWaitingREQ() {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.tellWaiting","id":"sendTellWaitingREQ_' + new Date().getTime() + '","params":[0,1000,["gid","totalLength","completedLength","uploadSpeed","downloadSpeed","connections","numSeeders","seeder","status","errorCode","files","bittorrent","dir","bitfield","infoHash","numPieces"]]}')
    }

    sendTellStopREQ() {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.tellStopped","id":"sendTellStopREQ_' + new Date().getTime() + '","params":[-1,1000,["gid","totalLength","completedLength","uploadSpeed","downloadSpeed","connections","numSeeders","seeder","status","errorCode","files","bittorrent","dir","bitfield","infoHash","numPieces"]]}')
    }

    sendGetGlobalOptionREQ() {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.getGlobalOption","id":"sendGetGlobalOptionREQ_' + new Date().getTime() + '"}')
    }

    sendForceRemoveREQ(gid) {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.remove","id":"sendForceRemoveREQ_' + new Date().getTime() + '","params":["' + gid + '"]}')
    }

    sendRemoveDownloadResultREQ(gid) {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.removeDownloadResult","id":"sendRemoveDownloadResultREQ_' + new Date().getTime() + '","params":["' + gid + '"]}')
    }

    sendPauseREQ(gid) {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.pause","id":"sendPauseREQ_' + new Date().getTime() + '","params":["' + gid + '"]}')
    }

    sendUnpauseREQ(gid) {
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.unpause","id":"sendUnpauseREQ_' + new Date().getTime() + '","params":["' + gid + '"]}')
    }

    sendAddUriREQ(url, params) {
        let p = "";
        for (let k in params) {
            p += '"' + k + '":"' + params[k] + '",';
        }
        p = p.substr(0, p.length - 1);
        let str = '[["' + url + '"],{' + p + '}]';
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.addUri","id":"sendAddUriREQ_' + new Date().getTime() + '","params":' + str + '}')
    }

    sendAddMetalinkREQ(url, params) {
        let p = "";
        for (let k in params) {
            p += '"' + k + '":"' + params[k] + '",';
        }
        p = p.substr(0, p.length - 1);
        let str = '[["' + url + '"],{' + p + '}]';
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.addMetalink","id":"sendAddMetalinkREQ_' + new Date().getTime() + '","params":' + str + '}')
    }

    sendAddTorrentREQ(code, params) {
        let p = "";
        for (let k in params) {
            p += '"' + k + '":"' + params[k] + '",';
        }
        p = p.substr(0, p.length - 1);
        let str = '["' + code + '",[],{' + p + '}]';
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.addTorrent","id":"sendAddTorrentREQ_' + new Date().getTime() + '","params":' + str + '}')
    }

    sendChangeGlobalOptionREQ(data) {
        let str = "";
        for (let k in data) {
            str += '"' + k + '":"' + data[k] + '",';
        }
        str = str.substr(0, str.length - 1);
        str = '[{' + str + '}]';
        this.ws.send('{"jsonrpc":"2.0","method":"aria2.changeGlobalOption","id":"sendChangeGlobalOptionREQ_' + new Date().getTime() + '","params":' + str + '}')
    }

    handleMsg(result) {
        if (result.id) {
            if (result.id.indexOf("sendGetGlobalStatREQ_") >= 0) {
                this.dispatch(getUpdateGlobalStat(result.result));
            } else if (result.id.indexOf("sendTellActiveREQ_") >= 0) {
                this.dispatch(getUpdateDownloadStats(result.result))
            } else if (result.id.indexOf("sendTellWaitingREQ_") >= 0) {
                this.dispatch(getUpdateWaitingStats(result.result))
            } else if (result.id.indexOf("sendTellStopREQ_") >= 0) {
                this.dispatch(getUpdateFinishStats(result.result))
            } else if (result.id.indexOf("sendGetGlobalOptionREQ_") >= 0) {
                this.dispatch(getUpdateGlobalOptionStat(result.result))
            } else if (result.id.indexOf("sendAddUriREQ_") >= 0) {
                if (result.error) {
                    this.dispatch(getBaseCommonAction(RpcWSCommand.Add_DOWNLOAD_ERROR, result))
                }
            } else if (result.id.indexOf("sendAddTorrentREQ_") >= 0) {
                if (result.error) {
                    this.dispatch(getBaseCommonAction(RpcWSCommand.Add_DOWNLOAD_ERROR, result))
                }
            } else if (result.id.indexOf("sendAddMetalinkREQ_") >= 0) {
                if (result.error) {
                    this.dispatch(getBaseCommonAction(RpcWSCommand.Add_DOWNLOAD_ERROR, result))
                }
            }
        } else {
            switch (result.method) {
                case "aria2.onDownloadStart": {
                    PanUtil.notify("通知", "任务开始下载",infoJpg);
                    break;
                }
                case "aria2.onDownloadComplete": {
                    PanUtil.notify("通知", "任务下载完毕",infoJpg);
                    break;
                }
                case "aria2.onDownloadError": {
                    PanUtil.notify("通知", "任务下载异常终止",errotPng);
                    break;
                }
            }
        }
    }

    render() {
        return (
            <span>
                <button className="btn btn-outline-light" style={{padding:'2px 15px'}}>&nbsp;{"ws://"+this.props.Aria2Link.ip+":"+this.props.Aria2Link.port+"/jsonrpc"}&nbsp;</button>
                &emsp;<i className={["fa fa-heartbeat", this.state.connected ? "text-light" : "text-danger"].join(" ")}> </i>
                &emsp;<i className="fa fa-cloud-upload text-light"> {this.getSize(Number(this.props.Global.uploadSpeed))} </i>&emsp;
                <i className="fa fa-cloud-download text-light"> {this.getSize(Number(this.props.Global.downloadSpeed))} </i>&emsp;
            </span>
        )
    }
}

const mapStateToProps = (state) => {
    return state
};

export default withRouter(connect(mapStateToProps)(RpcWSClient));