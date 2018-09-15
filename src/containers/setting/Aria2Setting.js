import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import {RpcWSCommand} from "../../constants/RpcWSCommand";
import {getAddCommandJob} from "../../actions/RPCWSAction";
import {Select} from "../../components/Form";
import {getBaseCommonAction} from "../../actions/CommonAction";
import {GlobalCommand} from "../../constants/GlobalCommand";


class Aria2Setting extends  Component{
    constructor(props){
        super(props)
        this.state={
            ip:'localhost',
            port:6800
        };
    }
    componentDidMount(){
    }

    changeValue(key,e){
        let kv={};
        kv[key]=e.target.value;
        this.setState(kv);
    }
    save(e){
        e.preventDefault();
        console.log(this.state)
        this.props.dispatch(getBaseCommonAction(GlobalCommand.RECONNECT,this.state));
    }
    render(){
        return (
            <form className='col-12 mt-3' >
                <div className="form-group">
                    <label>Aria2 服务器</label>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> ws : // </span>
                        </div>
                        <input type="text" className="form-control" value={this.state.ip} onChange={this.changeValue.bind(this,'ip')}/>
                        <span className="input-group-text" style={{borderRadius:0}}>:</span>
                        <input type="text" className="form-control" value={this.state.port}  onChange={this.changeValue.bind(this,'port')}/>
                        <div className="input-group-append">
                            <span className="input-group-text">/jsonrpc</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button className='btn btn-primary' onClick={this.save.bind(this)}>保存</button>
                </div>
            </form>
        );
    }
}

const mapStateToProps=(state)=>(state)

export default withRouter(connect(mapStateToProps)(Aria2Setting))