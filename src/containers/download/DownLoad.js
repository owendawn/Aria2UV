import React,{Component} from 'react'
import ReactRedux,{connect} from 'react-redux'
import ReactRouterDOM,{withRouter} from "react-router-dom";

import {getBaseCommonAction, getSimpleCommonAction} from '../../actions/CommonAction'
import {GlobalCommand} from "../../constants/GlobalCommand";
import Menu from '../../components/Menu'
import ToDownload from '../../components/ToDownload'
import Modal from "../../components/modal";
import {RpcWSCommand} from "../../constants/RpcWSCommand";
import {getAddCommandJob, getAddMetalink, getAddTorrent, getAddURL} from "../../actions/RPCWSAction";
import {Select} from "../../components/Form";



 class DownLoad extends Component{
    constructor(props){
        super(props);
        this.state={
            showMetalink:false,
            showBT:false,
            showURL:false,
            newOptions:{},
            btContent:null,
        }
    }
    componentDidMount(){
        this.props.dispatch(getSimpleCommonAction(GlobalCommand.OPEN_DOWNLOAD))
        this.props.dispatch(getAddCommandJob(getBaseCommonAction(RpcWSCommand.GLOBAL_OPTION_STAT)));
    }
     componentWillUnmount(){
         this.props.dispatch(getSimpleCommonAction(GlobalCommand.CLOSE_DOWNLOAD))
     }
     showModal(key,e){
        let it={};
        it[key]=!this.state[key];
        this.setState(it);
     }
     addURL(){
        this.setState({showURL:false});
         this.props.dispatch(getAddCommandJob(getAddURL(this.refs.urlArea.value,this.state.newOptions)));
     }
     addTorrent(){
         this.setState({showBT:false});
         this.props.dispatch(getAddCommandJob(getAddTorrent(this.state.btContent,this.state.newOptions)));
     }
     addMetalink(){
         this.setState({showMetalink:false});
         this.props.dispatch(getAddCommandJob(getAddMetalink(this.refs.metalinkArea.value,this.state.newOptions)));
     }
     removeDownloadError(it,e){
        this.props.dispatch(getBaseCommonAction(RpcWSCommand.REMOVE_DOWNLOAD_ERROR,it));
     }
     getGlobalOption(){
        return Object.assign({},this.props.GlobalOptions,this.state.newOptions);
     }
     changeValue(key,e,unit){
         let kv={};
         kv[key]=e.target.value;
         if(this.props.GlobalOptions[key]==e.target.value||e.target.value===""){
             let cp=this.state.newOptions;
             delete cp[key];
             this.setState({newOptions:cp});
         }else {
             this.setState({newOptions: Object.assign({}, this.state.newOptions, kv)});
         }
     }
     changeDownloadDir(dir){
        this.setState({newOptions:Object.assign({},this.state.newOptions,{dir:dir})})
     }
     changeBTCode(e){
        let that=this;
         let reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = function (e) {
            that.setState({btContent:this.result.replace("data:;base64,","")});
         }
     }
     chooseIt(gid){
        this.setState({chooseId:gid})
     }

    render(){
        return(
            <div className="row">
                <nav aria-label="breadcrumb" className='col-12'>
                    <ol className="breadcrumb  mb-0" style={{    padding: '0.2rem 1rem'}}>
                        <li className="breadcrumb-item"><a className='btn btn-link' href='#' onClick={this.showModal.bind(this,'showURL')}>新增下载链接</a></li>
                        <li className="breadcrumb-item"><a className='btn btn-link' href='#' onClick={this.showModal.bind(this,'showBT')}>新增BT</a></li>
                        <li className="breadcrumb-item"><a className='btn btn-link' href='#' onClick={this.showModal.bind(this,'showMetalink')}>新增MetaLink</a></li>
                    </ol>
                </nav>
                <div data-spy="scroll" data-target="#list-example" data-offset="0" className="scrollspy-example col-9" style={{paddingRight:0}}>
                    <div className="accordion" id="accordionExample">
                        {this.props.Downloads.map((it)=>(<ToDownload item={it} key={it.gid} choose={this.chooseIt.bind(this)} open={it.gid===this.state.chooseId}/>))}
                    </div>
                </div>
                <div className="list-group col-3">
                    <Menu/>
                </div>
                <Modal title='新增下载链接' show={this.state.showURL} beforeClose={this.showModal.bind(this,'showURL')} beforeOK={this.addURL.bind(this)}>
                    <div className="form-group">
                        <label>下载链接</label>
                        <textarea className="form-control"  rows="3" ref='urlArea'/>
                    </div>
                    <div className="form-group">
                        <label>下载路径</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={this.getGlobalOption().dir||""} onChange={this.changeValue.bind(this,"dir")}/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" title='设为桌面路径' onClick={this.changeDownloadDir.bind(this,'C:/Users/Administrator/Desktop')}><i className='fa fa-home'/></button>
                                <button className="btn btn-outline-secondary" type="button" title='设为预设路径' onClick={this.changeDownloadDir.bind(this,this.props.GlobalOptions.dir)}><i className='fa fa-cog'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>最大连接数({this.getGlobalOption()['max-connection-per-server']||""})</label>
                        <input className="form-control p-0" type='range' min='1' max={Math.max(this.getGlobalOption()['max-connection-per-server']||"",16)} value={this.getGlobalOption()['max-connection-per-server']||""} onChange={this.changeValue.bind(this,"max-connection-per-server")}/>
                    </div>
                    <div className="form-group">
                        <label>最大线程数</label>
                        <input className="form-control" type='number' value={this.getGlobalOption().split||""} onChange={this.changeValue.bind(this,"split")}/>
                    </div>
                    <div className="form-group">
                        <label>FTP类型</label>
                        <Select  className="form-control" list={[{value:'binary',name:'binary'},{value:'ascii',name:'ascii'}]} value={this.getGlobalOption()['ftp-type']} changeEvent={this.changeValue.bind(this,"ftp-type")}/>
                    </div>

                </Modal>
                <Modal title='新增BT' show={this.state.showBT} beforeClose={this.showModal.bind(this,'showBT')} beforeOK={this.addTorrent.bind(this)}>
                    <div className="form-group">
                        <label>BT文件</label>
                        <input type="file"  className="form-control btn btn-success" onChange={this.changeBTCode.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <label>下载路径</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={this.getGlobalOption().dir||""} onChange={this.changeValue.bind(this,"dir")}/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" title='设为桌面路径' onClick={this.changeDownloadDir.bind(this,'C:/Users/Administrator/Desktop')}><i className='fa fa-home'/></button>
                                <button className="btn btn-outline-secondary" type="button" title='设为预设路径' onClick={this.changeDownloadDir.bind(this,this.props.GlobalOptions.dir)}><i className='fa fa-cog'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>最大连接数({this.getGlobalOption()['max-connection-per-server']||""})</label>
                        <input className="form-control p-0" type='range' min='1' max={Math.max(this.getGlobalOption()['max-connection-per-server']||"",16)} value={this.getGlobalOption()['max-connection-per-server']||""} onChange={this.changeValue.bind(this,"max-connection-per-server")}/>
                    </div>
                    <div className="form-group">
                        <label>最大线程数</label>
                        <input className="form-control" type='number' value={this.getGlobalOption().split||""} onChange={this.changeValue.bind(this,"split")}/>
                    </div>
                    <div className="form-group">
                        <label>单BT最大连接数</label>
                        <input className="form-control" type='number' value={this.getGlobalOption()["bt-max-peers"]||""} onChange={this.changeValue.bind(this,"bt-max-peers")}/>
                    </div>
                </Modal>
                <Modal title='新增MetaLink' show={this.state.showMetalink} beforeClose={this.showModal.bind(this,'showMetalink')} beforeOK={this.addMetalink.bind(this)}>
                    <div className="form-group">
                        <label>下载链接</label>
                        <textarea className="form-control"  rows="3" ref='metalinkArea'/>
                    </div>
                    <div className="form-group">
                        <label>下载路径</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={this.getGlobalOption().dir||""} onChange={this.changeValue.bind(this,"dir")}/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" title='设为桌面路径' onClick={this.changeDownloadDir.bind(this,'C:/Users/Administrator/Desktop')}><i className='fa fa-home'/></button>
                                <button className="btn btn-outline-secondary" type="button" title='设为预设路径' onClick={this.changeDownloadDir.bind(this,this.props.GlobalOptions.dir)}><i className='fa fa-cog'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>最大连接数({this.getGlobalOption()['max-connection-per-server']||""})</label>
                        <input className="form-control p-0" type='range' min='1' max={Math.max(this.getGlobalOption()['max-connection-per-server']||"",16)} value={this.getGlobalOption()['max-connection-per-server']||""} onChange={this.changeValue.bind(this,"max-connection-per-server")}/>
                    </div>
                    <div className="form-group">
                        <label>最大线程数</label>
                        <input className="form-control" type='number' value={this.getGlobalOption().split||""} onChange={this.changeValue.bind(this,"split")}/>
                    </div>
                </Modal>

                <Modal title='提醒' show={this.props.DownloadErrors.length>0} beforeClose={this.removeDownloadError.bind(this,this.props.DownloadErrors[0])}>
                    {
                        (function (that) {
                            if(that.props.DownloadErrors.length>0){
                                return "下载链接异常"
                            }
                        })(this)
                    }
                </Modal>
            </div>
        );
    }
}
const mapStateToProps=(state)=>(state);

export default withRouter(connect(mapStateToProps)(DownLoad));