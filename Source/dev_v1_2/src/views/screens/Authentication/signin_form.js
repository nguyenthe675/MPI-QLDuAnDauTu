import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { renderTextField } from './form_helpers'
import Button from '@material-ui/core/Button'


class SigninForm extends Component {

  renderAlert() {
    if (this.props.errorMessage) {
      return <div className="alert alert-danger">
        <strong>Lỗi: </strong>{this.props.errorMessage}
      </div>
    }
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <React.Fragment>
        {this.renderAlert()}
        <form onSubmit={handleSubmit} className={this.props.classes.form} >

          <Field
            label="Username"
            name="username"
            component={renderTextField}
            fullWidth
            type="text" />

          <Field
            label="Password"
            name="password"
            component={renderTextField}
            fullWidth
            type="password" />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={this.props.classes.submit}

          >
            Đăng nhập
            </Button>
        </form>
      </React.Fragment>
    )
  }
}

export default reduxForm({
  form: 'signin'
})(SigninForm)
