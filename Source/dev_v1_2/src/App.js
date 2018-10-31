import React, { Component } from 'react';

import './App.css';
import Routes from './views/routes';
import { ToastContainer } from 'react-toastify';
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

import 'react-toastify/dist/ReactToastify.css';

import './assets/icon/icofont/css/icofont.css';
import './assets/icon/simple-line-icons/css/simple-line-icons.css';
import './assets/plugins/bootstrap/css/bootstrap.min.css';
import './assets/css/buttons.dataTables.min.css';
import './assets/css/main.css';
import './assets/css/responsive.css';
import './assets/css/color/color-1.min.css';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Routes />
        <ToastContainer />
      </MuiThemeProvider>
    );
  }
}

export default App;
