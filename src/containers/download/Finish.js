import React,{Component} from 'react'
import ReactRedux,{connect} from 'react-redux'
import ReactRouterDOM,{withRouter} from 'react-router-dom'

import {getSimpleCommonAction} from '../../actions/CommonAction'
import {GlobalCommand} from "../../constants/GlobalCommand";
import Menu from '../../components/Menu'
import ToDownload from '../../components/ToDownload'


class Finish extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    componentDidMount(){
        this.props.dispatch(getSimpleCommonAction(GlobalCommand.OPEN_FINISH_DOWNLOAD))
    }
    componentWillUnmount(){
        this.props.dispatch(getSimpleCommonAction(GlobalCommand.CLOSE_FINISH_DOWNLOAD))
    }
    chooseIt(gid){
        this.setState({chooseId:gid})
    }
    render(){
        return(
            <div className="row">
                <div data-spy="scroll" data-target="#list-example" data-offset="0" className="scrollspy-example col-9">
                    <div className="accordion" id="accordionExample">
                        {this.props.Finishs.map((it)=>(<ToDownload item={it} key={it.gid} choose={this.chooseIt.bind(this)} open={it.gid===this.state.chooseId}/>))}
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

export default withRouter(connect(mapStateToProps)(Finish));