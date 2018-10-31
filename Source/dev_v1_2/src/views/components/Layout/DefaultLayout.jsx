/**
 * Created by Taobao dev team 26/1/2018
 */
import React from 'react'
import DocumentTitle from "react-document-title"
import LoadingBar from 'react-redux-loading-bar'

/**
 * Default layout for anypage except dashboard
 * @param props
 * @returns {*}
 * @constructor
 */
export const DefaultLayout = (props) => (
    <DocumentTitle title={props.title + ' - Quản lý dự án đầu tư'}>
        <div>
            <LoadingBar style={{ backgroundColor: 'rgb(52, 152, 219)' }} />
            {props.children}
        </div>
    </DocumentTitle>
);
