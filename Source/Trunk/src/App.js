import React from 'react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import './assets/icon/icofont/css/icofont.css';
import './assets/icon/simple-line-icons/css/simple-line-icons.css';
import './assets/plugins/bootstrap/css/bootstrap.min.css';
import './assets/css/buttons.dataTables.min.css';
import './assets/css/main.css';
import './assets/css/responsive.css';
import './assets/css/color/color-1.min.css';

class App extends React.Component {
    render() {
        return (
            <div id={"gobiz-login-main"} className={""}>
                <Routes />
                <ToastContainer />
            </div>
        );
    }
}

export default App;
