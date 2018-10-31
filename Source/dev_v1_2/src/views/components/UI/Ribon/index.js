import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export default class Ribon extends Component {
    render() {
        const { breadCrumb } = this.props;
        return (
            <div className="row">
                <div className="col-sm-12 p-0">
                    <div className="main-header mt-0">
                        <ol className="breadcrumb breadcrumb-title breadcrumb-arrow">
                            <li className="breadcrumb-item">
                                <Link to={'/'}>
                                    <i className="icofont icofont-home"></i>
                                </Link>
                            </li>
                            {
                                breadCrumb.map((item, index) => {
                                    if (item.link) {
                                        return <li className="breadcrumb-item" key={index}>
                                            <Link to={item.link}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    }
                                    return <li className="breadcrumb-item" key={index}>
                                        <a href="/" >
                                            {item.name}
                                        </a>
                                    </li>
                                })
                            }
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}
