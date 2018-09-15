import React,{Component} from 'react'
import {withRouter,Link} from 'react-router-dom'
import {connect}from 'react-redux'

import './Menu.scss'

class Menu extends Component{
    constructor(props){
        super(props);
    }

    isActive(path){
        return this.props.location.pathname===path?"active":"";
    }

    render(){
        return (
            <div className="card">
                <ul className="list-group list-group-flush">
                    <Link to='/Download' className={["list-group-item list-group-item-action",this.isActive("/Download")].join(" ")} href=''>
                        正在下载&emsp;
                        <span className={["badge",this.isActive("/Download")?"badge-light":"badge-secondary"].join(" ")}>{this.props.Global.numActive||""}</span>
                    </Link>
                    <Link to='/Waiting' className={["list-group-item list-group-item-action",this.isActive("/Waiting")].join(" ")} href=''>
                        正在等待&emsp;
                        <span className={["badge",this.isActive("/Waiting")?"badge-light":"badge-secondary"].join(" ")}>{this.props.Global.numWaiting||""}</span>
                    </Link>
                    <Link to='/Finish' className={["list-group-item list-group-item-action",this.isActive("/Finish")].join(" ")} href=''>
                        已经结束&emsp;
                        <span className={["badge",this.isActive("/Finish")?"badge-light":"badge-secondary"].join(" ")}>{this.props.Global.numStopped||""}</span>
                    </Link>
                </ul>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                <div className="card-body">
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>(state);
export default withRouter(connect(mapStateToProps)(Menu));