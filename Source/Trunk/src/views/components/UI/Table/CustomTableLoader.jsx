import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
class CustomTableLoader extends React.Component {
    render() {
        {
            return this.props.loading ?
                <div className='-loading -active'>
                    <div className="-loading-inner">
                        <CircularProgress />
                    </div>
                </div> : null;
        }
    }
}

export default CustomTableLoader;