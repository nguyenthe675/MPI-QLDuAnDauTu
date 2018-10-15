import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../state/Authentication/auth.actions';
class Signout extends Component {

  componentWillMount() {
    this.props.signoutUser()
  }

  render() {
    return <div>
      <h2>Bạn đã đăng xuất khỏi hệ thống</h2>
      <h6>Xin đăng nhập lại <Link to='/login'>tại đây</Link></h6>
    </div>
  }
}

export default connect(null, actions)(Signout)