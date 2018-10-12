/**
 * create by Taobao dev team 18/1/2018
 */
import React, { Component } from 'react'
import DocumentTitle from "react-document-title"
import LoadingBar from 'react-redux-loading-bar'
import Header from '../Header'
import Sidebar from '../Sidebar'

class MainLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            minified: false
        }
    }


    render() {
        return (
            <DocumentTitle title={'Gobiz Login'}>
                <div className={`wraper position-re ${this.state.minified ? 'minified' : ''}`}>
                    <Header {...this.props} />
                    <Sidebar {...this.props} onMinified={() => this.setState({ minified: !this.state.minified })} />
                    <LoadingBar style={{ backgroundColor: 'rgb(52, 152, 219)' }} />
                    <div className={`content-wrapper ${this.props.className}`}>
                        <div className="container-fluid">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}


export default MainLayout;