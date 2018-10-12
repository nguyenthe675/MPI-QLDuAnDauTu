import React from 'react'
export default class NoSpaceInput extends React.Component {
    /**
     * change value
     * @param e
     */
    onChangeValue = (e) => {

        this.props.onChangeInput(e.target.value)
    };

    render() {
        return (
            <input
                {...this.props}
                onChange={this.onChangeValue}
            />
        );
    }
}