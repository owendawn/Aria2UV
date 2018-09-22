import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import {RpcWSCommand} from "../../constants/RpcWSCommand";
import {getAddCommandJob} from "../../actions/RPCWSAction";
import {Select} from "../../components/Form";
import {getBaseCommonAction} from "../../actions/CommonAction";


class CommonSetting extends  Component{
    constructor(props){
        super(props);
        this.state={
            newOptions:{},
        };
    }
    componentDidMount(){
        this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.GLOBAL_OPTION_STAT)));
    }
    getNewCfg(){
        return Object.assign({},this.props.GlobalOptions,this.state.newOptions);
    }
    changeValue(key,e,unit){
        let kv={};
        kv[key]=e.target.value;
        if(key==="min-split-size"){
            kv[key]=e.target.value*1024*1024;
        }
        if(this.props.GlobalOptions[key]==e.target.value||e.target.value===""){
            let cp=this.state.newOptions;
            delete cp[key];
            this.setState({newOptions:cp});
        }else {
            this.setState({newOptions: Object.assign({}, this.state.newOptions, kv)});
        }
    }
    save(){
        let cp=this.state.newOptions;
        this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.UPDATE_GLOBAL_OPTION_STAT,cp)));
    }
    render(){
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                    <tr><th scope="col">#</th><th scope="col">&nbsp;</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>保存路径(dir)</td><td><input  className="form-control" type="text" value={this.getNewCfg().dir||""} onChange={this.changeValue.bind(this,"dir")}/></td></tr>
                        <tr><td>断点续传(continue)</td><td><Select  className="form-control" list={[{value:true,name:'是'},{value:false,name:'否'}]} value={this.getNewCfg().continue} changeEvent={this.changeValue.bind(this,"continue")}/></td></tr>
                        <tr><td>最大下载任务数(max-concurrent-downloads)</td><td><input  className="form-control" type="number" value={this.getNewCfg()["max-concurrent-downloads"]||""} onChange={this.changeValue.bind(this,"max-concurrent-downloads")}/></td></tr>
                        <tr><td>单服务器最大连接数(max-connection-per-server)</td><td><input  className="form-control" type="number" value={this.getNewCfg()["max-connection-per-server"]||""} onChange={this.changeValue.bind(this,"max-connection-per-server")}/></td></tr>
                        <tr><td>最小文件分片大小(min-split-size)</td><td>
                            <div className="input-group">
                                <input type="number" className="form-control"  value={this.getNewCfg()["min-split-size"]?(this.getNewCfg()["min-split-size"]/1024/1024):""} onChange={this.changeValue.bind(this,"min-split-size")}/>
                                <div className="input-group-append">
                                    <span className="input-group-text" >M</span>
                                </div>
                            </div>
                        </td></tr>
                        <tr><td>单任务最大线程数(split)</td><td><input  className="form-control"  type="number" value={this.getNewCfg().split||""} onChange={this.changeValue.bind(this,"split")}/></td></tr>
                        <tr><td>最大重试次数(max-tries)</td><td><input className="form-control"  type="number" value={this.getNewCfg()['max-tries']||""} onChange={this.changeValue.bind(this,"max-tries")}/></td></tr>
                        <tr><td>重试等待时间(retry-wait)</td><td><input className="form-control"  type="number" value={this.getNewCfg()['retry-wait']||""} onChange={this.changeValue.bind(this,"retry-wait")}/></td></tr>
                        <tr><td>文件未找到重试次数(rmax-file-not-found)</td><td><input className="form-control"  type="number" value={this.getNewCfg()['max-file-not-found']||""} onChange={this.changeValue.bind(this,"max-file-not-found")}/></td></tr>
                        <tr><td colSpan={2} className='bg-info'></td></tr>

                        <tr><td>启动下载未完成BT任务(bt-seed-unverified)</td><td><Select  className="form-control"  list={[{value:true,name:'是'},{value:false,name:'否'}]} value={this.getNewCfg()['bt-seed-unverified']} changeEvent={this.changeValue.bind(this,"bt-seed-unverified")}/></td></tr>
                        <tr><td>保存磁链为BT任务(bt-save-metadata)</td><td><Select className="form-control"  list={[{value:true,name:'是'},{value:false,name:'否'}]} value={this.getNewCfg()['bt-save-metadata']} changeEvent={this.changeValue.bind(this,"bt-save-metadata")}/></td></tr>
                        <tr><td>BT任务下载最大文件数(bt-max-open-files)</td><td><input className="form-control"  type="number" value={this.getNewCfg()['bt-max-open-files']||""} onChange={this.changeValue.bind(this,"bt-max-open-files")}/></td></tr>


                        <tr><td></td><td><button className='btn btn-primary' onClick={this.save.bind(this)}>保存</button></td></tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps=(state)=>(state)

export default withRouter(connect(mapStateToProps)(CommonSetting))