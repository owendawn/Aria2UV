import React, {Component} from 'react';
import {Switch, Route, Link,withRouter,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import './App.scss'
import 'jquery'
import 'bootstrap';

import CommonSetting from './setting/CommonSetting'
import Download from './download/DownLoad'
import Finish from './download/Finish'
import Waiting from './download/Waiting'

import RpcWSClient from './RpcWSClient'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    getSize(size){
        if(isNaN(Number(size))){
            return ' -- ';
        }
        if(size>1024*1024*1024) {
            return Math.round(size * 100 / 1024 / 1024/1024) / 100 + "G/s";
        }else if(size>1024*1024){
            return Math.round(size*100/1024/1024 )/100+"M/s";
        }else if(size>1024){
            return Math.round(size*100/1024 )/100+"K/s";
        }else{
            return size+"B/s";
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-info">
                    <Link to='/Download' className="navbar-brand">Aria2UV</Link>
                    <button className="navbar-toggler" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent">
                        <span className="navbar-toggler-icon">&nbsp;</span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link to='/Download' className="nav-link">下载管理</Link>
                            </li>
                            <li className="nav-item dropdown active">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                   data-toggle="dropdown">
                                    Aria2配置
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link to='/CommonSetting' className="dropdown-item">通用设置</Link>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <div className="dropdown-divider">&nbsp;</div>
                                    <Link to='/CommonSetting' className="dropdown-item">RCP设置</Link>
                                </div>
                            </li>
                        </ul>
                        <span className="navbar-text">
                            <RpcWSClient />&emsp;
                            <i className="fa fa-cloud-upload text-light"> {this.getSize(Number(this.props.Global.uploadSpeed))} </i>&emsp;
                            <i className="fa fa-cloud-download text-light"> {this.getSize(Number(this.props.Global.downloadSpeed))} </i>&emsp;
                        </span>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search"/>
                            <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
                <main>
                    <Switch>
                        <Route exact path='/'  render={() => <Redirect to="/Download" />}/>
                        <Route exact path='/Download' component={Download}/>
                        <Route exact path='/Finish' component={Finish}/>
                        <Route exact path='/Waiting' component={Waiting}/>
                        <Route exact path='/CommonSetting' component={CommonSetting}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state
};



export default withRouter(connect(mapStateToProps)(App))