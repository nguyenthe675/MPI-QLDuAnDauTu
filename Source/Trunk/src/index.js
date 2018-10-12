import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { authType } from './state/Authentication/auth.type';
import { store } from './helpers';
import appService from './services/app.service';
const token = localStorage.getItem('token');
if (appService.isLoggedIn()) {
    store.dispatch({ type: authType.AUTH_USER })
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
