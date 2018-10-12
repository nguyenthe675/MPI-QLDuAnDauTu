import React, { Component } from 'react';
import SigninForm from './signin_form';
import * as actions from '../../../state/Authentication/auth.actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Signin extends Component {

  componentWillUnmount() {
    if (this.props.errorMessage) {
      this.props.authError(null)
    }
  }

  displayRedirectMessages() {
    const location = this.props.location
    return location.state && <div className="alert alert-danger">{location.state.message}</div>
  }

  handleSubmit({ email, password }) {
    this.props.signinUser({ email, password })
  }

  getRedirectPath() {
    const locationState = this.props.location.state
    if (locationState && locationState.from.pathname) {
      return locationState.from.pathname // redirects to referring url
    } else {
      return '/'
    }
  }

  render() {

    const { classes } = this.props;

    return (this.props.authenticated) ?
      <Redirect to={{
        pathname: this.getRedirectPath(), state: {
          from: this.props.location
        }
      }} />
      :
      <React.Fragment>
        {this.displayRedirectMessages()}
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng nhập hệ thống
              </Typography>
            <SigninForm onSubmit={this.handleSubmit.bind(this)} errorMessage={this.props.errorMessage} classes={classes} />
          </Paper>
        </main>
      </React.Fragment>
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    errorMessage: state.auth.error
  }
}

export default withStyles(styles)(connect(mapStateToProps, actions)(Signin))