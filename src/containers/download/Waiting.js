import React,{Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import {getSimpleCommonAction} from '../../actions/CommonAction'
import {GlobalCommand} from "../../constants/GlobalCommand";
import Menu from '../../components/Menu'
import ToDownload from '../../components/ToDownload'

import './Download.scss'

class Waiting extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.dispatch(getSimpleCommonAction(GlobalCommand.OPEN_WAIT_DOWNLOAD))
    }
    componentWillUnmount(){
        this.props.dispatch(getSimpleCommonAction(GlobalCommand.CLOSE_WAIT_DOWNLOAD))
    }
    render(){
        return(
            <div className="row">
                <div data-spy="scroll" data-target="#list-example" data-offset="0" className="scrollspy-example col-9">
                    <div className="accordion" id="accordionExample">
                        {this.props.Waitings.map((it)=>(<ToDownload item={it} key={it.gid}/>))}
                    </div>
                </div>
                <div className="list-group col-3">
                    <Menu/>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>(state);

export default withRouter(connect(mapStateToProps)(Waiting));