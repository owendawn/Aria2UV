import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import { createStore } from 'redux'
import {BrowserRouter} from 'react-router-dom'

import App from './containers/App'
import rootReducer from './reducers/index'

const renderDom = Component => {
    render(
        <Provider store={createStore(rootReducer)}>
            <BrowserRouter>
                <Component/>
            </BrowserRouter>
        </Provider>
                ,
        document.getElementById('app')
    );
}
renderDom(App);