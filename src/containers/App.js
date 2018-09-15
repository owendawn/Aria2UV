import React, {Component} from 'react';
import {Switch, Route, Link,withRouter,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import './App.scss'
import 'jquery'
import 'bootstrap';

import Aria2Setting from './setting/Aria2Setting'
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
                                    <Link to='/Aria2Setting' className="dropdown-item">Aria2服务器配置</Link>
                                    <div className="dropdown-divider" style={{borderTopWidth:'2px'}}/>
                                    <Link to='/CommonSetting' className="dropdown-item">通用设置</Link>
                                </div>
                            </li>
                        </ul>
                        <span className="navbar-text">
                            <RpcWSClient />
                        </span>
                    </div>
                </nav>
                <main style={{overflowX:'hidden'}}>
                    <Switch>
                        <Route exact path='/'  render={() => <Redirect to="/Download" />}/>
                        <Route exact path='/Download' component={Download}/>
                        <Route exact path='/Finish' component={Finish}/>
                        <Route exact path='/Waiting' component={Waiting}/>
                        <Route exact path='/CommonSetting' component={CommonSetting}/>
                        <Route exact path='/Aria2Setting' component={Aria2Setting}/>
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