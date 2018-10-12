import React, {Component} from 'react'

export default class ContextMenuItem extends Component {
    static defaultProps = {

    };

    render() {
        return <li className="action" onClick={this.props.onClick}>
            {this.props.children}
        </li>
    }
}