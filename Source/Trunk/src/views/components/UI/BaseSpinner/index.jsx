import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
export default class index extends React.Component {
    render() {
        return (
            <div className="loadingIcon" >
                <div className="overlay">
                    <div className="loadingImg">
                        <CircularProgress></CircularProgress>
                    </div>
                </div>
            </div>
        );
    }
}