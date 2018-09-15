import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {PanUtil}from '../util/PanUtil'

import  'bootstrap'

import './ToDownload.scss'
import {getBaseCommonAction} from "../actions/CommonAction";
import {RpcWSCommand} from "../constants/RpcWSCommand";
import {getAddCommandJob} from "../actions/RPCWSAction";
import {ErrorCode} from "../util/ErrorCode";

class ToDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showbtlist:false
        }
        // console.log(this.props.item)
    }

    toggle() {
        this.setState({show: !this.state.show});
        this.props.choose(this.props.item.gid);
    }

    toggleBtList(){
        this.setState({showbtlist:!this.state.showbtlist})
    }

    getCastTime(){
        let time="00:00:00";
        if(this.props.item.downloadSpeed!=="0"){
            let leave=Number(this.props.item.totalLength)-Number(this.props.item.completedLength);
            let long=Math.round(leave/Number(this.props.item.downloadSpeed));
            time=Math.floor(long/60/60)+":"+Math.floor(long%(60*60)/60)+":"+Math.floor(long%60);
        }
        return time;
    }

    getSize(size){
        size=Number(size);
        if(size>1024*1024*1024) {
            return Math.round(size * 100 / 1024 / 1024/1024) / 100 + "G";
        }else if(size>1024*1024){
            return Math.round(size*100/1024/1024 )/100+"M";
        }else if(size>1024){
            return Math.round(size*100/1024 )/100+"K";
        }else{
            return size+"B";
        }
    }

    getDownloadSpeed(){
        let str="（"+this.getSize(Number(this.props.item.completedLength))+"/"+this.getSize(Number(this.props.item.totalLength))+"）";
        return this.getSize(Number(this.props.item.downloadSpeed))+"/s"+str;
    }

    getFileCount(){
        let all=0,end=0;
        this.props.item.files.forEach((it,idx)=>{
            if(it.selected==="true") {
                all++;
                if (it.completedLength === it.length) {
                    end++;
                }
            }
        });
        return end+"/"+all;
    }

    parseState(state){
        switch(state){
            case "active":return "正在下载";
            case "complete":return "已完成";
            case "error":return "异常终止";
            case "paused":return "暂停";
            case "removed":return "已删除";
            default:
                return "未知"
        }
    }
    command(type){
        console.log(this.props.item)
        if(type==="remove") {
            if (this.props.item.status === "error" || this.props.item.status === "complete"|| this.props.item.status === "removed") {
                this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.REMOVE_DOWNLOAD_RESULT,this.props.item.gid)))
            } else {
                this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.FORCE_REMOVE, this.props.item.gid)));
            }
        }else if(type==="pause"){
            this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.PAUSE, this.props.item.gid)));
        }else if(type==="unpause"){
            this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.UNPAUSE, this.props.item.gid)));
        }else if(type==="redownload"){

        }
    }



    render() {
        let ratio = '0%';
        if (this.props.item.completedLength !== "0") {
            ratio = Math.round(Number(this.props.item.completedLength) * 10000 / Number(this.props.item.totalLength)) / 100 + "%";
        }

        let name;
        if(this.props.item.bittorrent) {
            name=this.props.item.bittorrent.info?this.props.item.bittorrent.info.name:this.props.item.files[0].path;
        }else{
            name=this.props.item.files[0].path.substring(this.props.item.dir.length+1);
        }

        let arr1 = [];
        let complete = 0;
        if(this.props.item.bitfield) {
            let arr = this.props.item.bitfield.split("");
            arr.forEach(it => {
                if (it === "0") {
                    arr1 = arr1.concat(0, 0, 0, 0);
                } else if (it === "8") {
                    complete++;
                    arr1 = arr1.concat(1, 0, 0, 0)
                } else if (it === "c") {
                    complete += 2;
                    arr1 = arr1.concat(1, 1, 0, 0)
                } else if (it === "e") {
                    complete += 3;
                    arr1 = arr1.concat(1, 1, 1, 0)
                } else if (it === "f") {
                    complete += 4;
                    arr1 = arr1.concat(1, 1, 1, 1)
                }
            });
        }

        return (
            <div className="card download-area">
                <div className="card-header" id={"headingOne" + this.props.item.gid}>
                    <div className="mb-0 row">
                        <div className='col-md-1 col-12'>
                            <button className="btn btn-link"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target={"#collapseOne" + this.props.item.gid}
                                    aria-expanded="true"
                                    aria-controls={"collapseOne" + this.props.item.gid}
                                    onClick={this.toggle.bind(this)}
                                    style={{fontSize: '16pt', lineHeight: '14pt',paddingLeft:'0',marginTop:'-3px'}}>
                                <i className={['fa', this.state.show&&this.props.open ? ' fa-angle-double-up' : ' fa-angle-double-down'].join(" ")}>&nbsp;</i>
                            </button>
                        </div>
                        <div className='col-md-7 col-12 row'>
                            <span className='download-name col-12'
                                  title={name}>
                            {name}</span>
                        </div>
                        <div className='col-md-4 col-12' style={{paddingRight:0}}>
                            <span >{this.getDownloadSpeed()}</span>
                            <div className="dropdown float-right">
                                <button className="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{padding:' 0.05rem 0.5rem'}}/>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {this.props.item.status==="paused"&&<a className="dropdown-item text-success" href="#"  onClick={this.command.bind(this,"unpause")}>开始</a>}
                                    {this.props.item.status==="active"&&<a className="dropdown-item text-warning" href="#"  onClick={this.command.bind(this,"pause")}>暂停</a>}
                                    <div className='dropdown-divider'/>
                                    <a className="dropdown-item text-danger" href="#" onClick={this.command.bind(this,"remove")}>删除</a>
                                </div>
                            </div>
                        </div>
                        <div className='col-12' style={{padding: '0 30px',marginTop:'3px'}}>
                            <div className='row'>
                                <div className="progress col-md-9 col-12" style={{padding:0,marginTop:'5px'}}>
                                    <div className={["progress-bar progress-bar-striped",this.props.item.status==="active"?'progress-bar-animated':""].join(" ")} role="progressbar"
                                        style={{width: ratio}}> {ratio} </div>
                                </div>
                                <div className='col-md-3 col-12'>
                                    <span>{this.getCastTime()}</span><span className='float-right'>{this.getFileCount()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div id={"collapseOne" + this.props.item.gid}
                     className="collapse"
                     aria-labelledby={"headingOne" + this.props.item.gid}
                     data-parent="#accordionExample">
                    {this.props.open &&<div>
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab"
                                   href={"#nav-home" + this.props.item.gid} role="tab" aria-controls="nav-home"
                                   aria-selected="true">总览</a>
                                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab"
                                   href={"#nav-profile" + this.props.item.gid} role="tab" aria-controls="nav-profile"
                                   aria-selected="false">区块信息</a>
                                <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab"
                                   href={"#nav-contact" + this.props.item.gid} role="tab" aria-controls="nav-contact"
                                   aria-selected="false">文件列表</a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent" style={{fontSize:'12px'}}>
                            <div className="tab-pane fade show active" id={"nav-home" + this.props.item.gid}
                                 role="tabpanel" aria-labelledby="nav-home-tab">
                                <table className="table table-striped">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">&nbsp;</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>任务状态</td>
                                        <td>{this.parseState(this.props.item.status)}</td>
                                    </tr>
                                    {this.props.item.errorCode&& <tr>
                                        <td>描述</td>
                                        <td>{ErrorCode[this.props.item.errorCode]}</td>
                                    </tr>}
                                    <tr>
                                        <td>连接数</td>
                                        <td>{this.props.item.connections}</td>
                                    </tr>
                                    <tr>
                                        <td>下载路径</td>
                                        <td>{this.props.item.dir}</td>
                                    </tr>
                                    {this.props.item.files[0].uris.length > 0 && <tr>
                                        <td>下载链接</td>
                                        <td>{this.props.item.files[0].uris[0].uri || ""}</td>
                                    </tr>}
                                    {this.props.item.infoHash && <tr>
                                        <td>特征值</td>
                                        <td>{this.props.item.infoHash}</td>
                                    </tr>}
                                    {this.props.item.announceList && (<tr>
                                        <td>BT服务器&emsp;
                                            <a className='pointer' onClick={this.toggleBtList.bind(this)}>
                                                <i className={["fa", this.state.showbtlist ? "fa-chevron-up" : "fa-chevron-down"].join(" ")}>&nbsp;</i>
                                            </a></td>
                                        <td><textarea
                                            rows={this.state.showbtlist ? this.props.item.bittorrent.announceList.length + 1 : 2}
                                            defaultValue={this.props.item.bittorrent.announceList.map((it, idx) => (it + "\n")).join("")}
                                            style={{width: '100%', resize: "none", overflow: 'auto'}}
                                        /></td>
                                    </tr>)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="tab-pane fade" id={"nav-profile" + this.props.item.gid} role="tabpanel"
                                 aria-labelledby="nav-profile-tab">
                                <div className="tab-pane active">
                                    <div className='mt-1'>&nbsp;</div>
                                    <div className="piece-legends col-12 text-center" title="已完成: 0, 共计: 3197 块">
                                        <span className='pointer'
                                              title={"已完成: " + complete + ", 共计: " + this.props.item.numPieces + " 块"}>
                                            <span className="piece complete">&nbsp;</span><span>已完成</span>&emsp;
                                            <span className="piece">&nbsp;</span><span>未完成</span>
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        {arr1.map((it, idx) => (
                                            idx + 1 <= Number(this.props.item.numPieces) &&
                                            <div className={["piece", it === 1 ? "complete" : ""].join(" ")}
                                                 key={idx}>&nbsp;</div>
                                        ))}
                                    </div>
                                    <div className='mb-3'>&nbsp;</div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id={"nav-contact" + this.props.item.gid} role="tabpanel"
                                 aria-labelledby="nav-contact-tab">
                                <table className="table table-striped">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col" style={{width: '75%'}}>文件名</th>
                                        <th scope="col">&nbsp;</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.props.item.files.map((it, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{it.path}</td>
                                            <td>{this.getSize(it.completedLength) + " / " + this.getSize(it.length)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>}
                </div>

            </div>

        )
    }
}

export default withRouter(connect()(ToDownload));