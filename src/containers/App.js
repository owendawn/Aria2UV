import React, {Component} from 'react';
import {Switch, Route, Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import './App.scss'
import 'jquery'
import 'bootstrap';

import CommonSetting from './setting/CommonSetting'
import Download from './download/DownLoad'

import RpcWSClient from './RpcWSClient'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                            <i className="fa fa-cloud-upload"> {this.props.global.uploadSpeed} </i>&emsp;
                            <i className="fa fa-cloud-download"> {this.props.global.downloadSpeed} </i>&emsp;
                        </span>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search"/>
                            <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
                <main>
                    <Switch>
                        <Route exact path='/'  render={() => <Redirect to="/Downlaod" />} key="home"/>
                        <Route exact path='/Download' component={Download} key="download"/>
                        <Route exact path='/CommonSetting' component={CommonSetting} key="commonsettin"/>
                    </Switch>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        global: state.Global,
    }
};



export default withRouter(connect(mapStateToProps)(App))