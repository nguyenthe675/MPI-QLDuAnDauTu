import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../state/Authentication/auth.actions';
class NotFoundPage extends Component {

  componentWillMount() {
    //this.props.signoutUser()
  }

  render() {
    // return <div>
    //   <h2>Trang bạn yêu cầu không tồn tại!</h2>
    //   <h6>Quay lại <Link to='/'>trang chủ</Link></h6>
    // </div>
    return <div className='error-404'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className="text-uppercase text-center">
              <h1>404</h1>
              <h5>Trang không tồn tại</h5>
              <p>oops! không tìm thấy trang bạn yêu cầu</p>
              <Link to='/' className="btn btn-error btn-lg waves-effect">Trở lại trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(null, actions)(NotFoundPage)