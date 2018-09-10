import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import {RpcWSCommand} from "../../constants/RpcWSCommand";
import {getAddCommandJob} from "../../actions/RPCWSAction";
import {Select} from "../../components/Form";

class CommonSetting extends  Component{
    constructor(props){
        super(props)
        this.state=props.GlobalOptions;
    }
    componentDidMount(){
        this.props.dispatch(getAddCommandJob(RpcWSCommand.GLOBAL_OPTION_STAT));
    }
    changeValue(key,e){
        let kv={};
        kv[key]=e.target.value;
        this.setState(kv);
        console.log(this.state)
    }
    render(){
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                    <tr><th scope="col">#</th><th scope="col">&nbsp;</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>保存路径</td><td><input type="text" value={this.props.GlobalOptions.dir||""} onChange={this.changeValue.bind(this,"dir")}/></td></tr>
                        <tr><td>断点续传</td><td><Select list={[{value:true,name:'是'},{value:false,name:'否'}]} value={this.props.GlobalOptions.continue}/></td></tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps=(state)=>(state)

export default withRouter(connect(mapStateToProps)(CommonSetting))