import React, {Component} from 'react'

export default class ContextMenu extends Component {
    /**
     * Should pass item here to check if we need to render or re-render the context menu
     * @type {{item: null}}
     */
    static defaultProps = {
        item: null
    };

    shouldComponentUpdate = (nextProps)=> {
        if (!this.props.item) return true;

        return JSON.stringify(this.props.item) === nextProps.item;
    };

    render() {
        return <ul className="list-unstyled">
            {this.props.children}
        </ul>
    }
}