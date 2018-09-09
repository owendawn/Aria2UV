import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {PanUtil}from '../util/PanUtil'

import  'bootstrap'

import './ToDownload.scss'

class ToDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showbtlist:false
        }
        console.log(props.item)
    }

    toggle() {
        this.setState({show: !this.state.show});
    }

    toggleBtList(){
        this.setState({showbtlist:!this.state.showbtlist})
    }

    getCastTime(){
        let time="00:00:00";
        if(this.props.item.downloadSpeed!=="0"){
            let leave=Number(this.props.item.totalLength)-Number(this.props.item.completedLength);
            let long=Math.round(leave/Number(this.props.item.downloadSpeed));
            time=Math.floor(long/60/60)+":"+Math.floor(long/60)+":"+Math.floor(long%60);
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
        let str="  （"+this.getSize(Number(this.props.item.completedLength))+" / "+this.getSize(Number(this.props.item.totalLength))+"）";
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
            default:
                return "未知"
        }
    }

    render() {
        let ratio = '0%';
        if (this.props.item.completedLength !== "0") {
            ratio = Math.round(Number(this.props.item.completedLength) * 10000 / Number(this.props.item.totalLength)) / 100 + "%";
        }

        let createDate=new Date();
        createDate.setMilliseconds(this.props.item.bittorrent.creationDate);

        let arr=this.props.item.bitfield.split("");
        let complete=0;
        arr.forEach((it)=>{it==="f"&&(complete+=4)});
        return (
            <div className="card download-area">
                <div className="card-header" id={"headingOne" + this.props.item.gid}>
                    <h5 className="mb-0">
                        <button className="btn btn-link"
                                type="button"
                                data-toggle="collapse"
                                data-target={"#collapseOne" + this.props.item.gid}
                                aria-expanded="true"
                                aria-controls={"collapseOne" + this.props.item.gid}
                                onClick={this.toggle.bind(this)}
                                style={{fontSize: '16pt', lineHeight: '14pt'}}>
                            <i className={['fa', this.state.show ? ' fa-angle-double-up' : ' fa-angle-double-down'].join(" ")}>&nbsp;</i>
                        </button>
                        <span><input type='checkbox' />&emsp;</span>
                        <span className='download-name'
                              title={this.props.item.bittorrent.info.name}>
                            {this.props.item.bittorrent.info.name}</span>
                        <span className='float-right'>{this.getDownloadSpeed()}</span>
                        <span className='float-right'>{this.props.item.connections+"个连接"}&emsp;</span>

                        <div className='col-12'>
                            <div className='row'>
                                <div className="progress col-9" style={{padding:0}}>
                                    <div className="progress-bar progress-bar-striped" role="progressbar"
                                        style={{width: ratio}}> {ratio} </div>
                                </div>
                                <div className='col-3'>
                                    <span>{this.getCastTime()}</span><span className='float-right'>{this.getFileCount()}</span>
                                </div>
                            </div>
                        </div>
                    </h5>
                </div>

                <div id={"collapseOne" + this.props.item.gid}
                     className="collapse"
                     aria-labelledby={"headingOne" + this.props.item.gid}
                     data-parent="#accordionExample">
                    <div>
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href={"#nav-home"+this.props.item.gid} role="tab" aria-controls="nav-home" aria-selected="true">总览</a>
                                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href={"#nav-profile"+this.props.item.gid} role="tab" aria-controls="nav-profile" aria-selected="false">区块信息</a>
                                <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href={"#nav-contact"+this.props.item.gid} role="tab" aria-controls="nav-contact" aria-selected="false">文件列表</a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id={"nav-home"+this.props.item.gid} role="tabpanel" aria-labelledby="nav-home-tab">
                                <table className="table table-striped">
                                    <thead>
                                    <tr><th scope="col">#</th><th scope="col">&nbsp;</th></tr>
                                    </thead>
                                    <tbody>
                                    <tr><td>任务状态</td><td>{this.parseState(this.props.item.status)}</td></tr>
                                    <tr><td>创建时间</td><td>{PanUtil.dateFormat.format(createDate,'yyyy-MM-dd HH:mm:ss')}</td></tr>
                                    <tr><td>特征值</td><td>{this.props.item.infoHash}</td></tr>
                                    <tr><td>下载路径</td><td>{this.props.item.dir}</td></tr>
                                    <tr><td>BT服务器&emsp;
                                        <a className='pointer' onClick={this.toggleBtList.bind(this)}>
                                            <i className={["fa",this.state.showbtlist?"fa-chevron-up":"fa-chevron-down"].join(" ")}>&nbsp;</i>
                                        </a></td>
                                        <td><textarea
                                            rows={this.state.showbtlist?this.props.item.bittorrent.announceList.length+1:2}
                                            defaultValue={this.props.item.bittorrent.announceList.map((it,idx)=>(it+"\n")).join("")}
                                            style={{width:'100%',resize:"none",overflow:'auto'}}
                                        /></td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="tab-pane fade" id={"nav-profile"+this.props.item.gid} role="tabpanel" aria-labelledby="nav-profile-tab">
                                <div className="tab-pane active" >
                                    <div className='mt-1'>&nbsp;</div>
                                    <div className="piece-legends col-12 text-center" title="已完成: 0, 共计: 3197 块">
                                        <span className='pointer' title={"已完成: "+complete+", 共计: "+this.props.item.numPieces+" 块"}>
                                            <span className="piece complete">&nbsp;</span><span>已完成</span>&emsp;
                                            <span className="piece">&nbsp;</span><span>未完成</span>
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        {arr.map((it,idx)=>(idx*4<Number(this.props.item.numPieces)&&<div className={["piece",it==="f"?"complete":""].join(" ")} key={idx}>&nbsp;</div>))}
                                    </div>
                                    <div className='mb-3'>&nbsp;</div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id={"nav-contact"+this.props.item.gid} role="tabpanel" aria-labelledby="nav-contact-tab">
                                <table className="table table-striped">
                                    <thead>
                                    <tr><th scope="col">#</th><th scope="col" style={{width:'75%'}}>文件名</th><th scope="col">&nbsp;</th></tr>
                                    </thead>
                                    <tbody>
                                    { this.props.item.files.map((it,idx)=>(
                                        <tr key={idx}><td>{idx+1}</td><td>{it.path}</td><td>{this.getSize(it.completedLength)+" / "+this.getSize(it.length)}</td></tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>


            </div>

        )
    }
}

export default withRouter(connect()(ToDownload));