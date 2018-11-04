import React from 'react';
import ReactDOM,{render} from 'react-dom';
import ReactRedux,{Provider} from 'react-redux'
import Redux,{ createStore } from 'redux'
import ReactRouterDOM,{BrowserRouter} from 'react-router-dom'

import App from './containers/App'
import rootReducer from './reducers/index'

const renderDom = Component => {
    ReactDOM.render(
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