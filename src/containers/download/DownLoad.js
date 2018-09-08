import React,{Component} from 'react'
import {connect} from 'react-redux'
import {getSimpleCommonAction} from '../../actions/CommonAction'
import {GlobalCommand} from "../../constants/GlobalCommand";
import {withRouter} from "react-router-dom";


 class DownLoad extends Component{
    constructor(props){
        super(props)
        console.log(props)
    }
    componentDidMount(){
        this.props.dispatch(getSimpleCommonAction(GlobalCommand.OPEN_DOWNLOAD))
    }
     componentWillUnmount(){
         this.props.dispatch(getSimpleCommonAction(GlobalCommand.CLOSE_DOWNLOAD))
     }
    render(){

        return(
            <div>下载管理
                {this.props.downloads.map((it,idx,all)=>(<div key={idx}>{it.bittorrent.info.name}</div>))}
            </div>
        );
    }
}
const mapStateToProps=(state)=>({
    downloads:state.Downloads
});

export default withRouter(connect(mapStateToProps)(DownLoad));