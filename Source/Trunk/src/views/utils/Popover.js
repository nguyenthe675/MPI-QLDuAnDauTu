import React, {Component} from 'react'

export default class Popover extends Component {
    constructor(props) {
        super(props)
        this.state = {
            target: props.target,
            isOpen: props.isOpen,
            popOverClass: ""
        };

        this.handleClickOutSide = this.handleClickOutSide.bind(this)
    }

    componentDidUpdate(preProps,preState){
        if(JSON.stringify(this.props.isOpen) !== JSON.stringify(preProps.isOpen)) {
            this.setState({
                target: document.getElementById(this.props.target),
                isOpen: this.props.isOpen,
                popOverClass: this.props.popOverClass
            })

            if(this.props.isOpen) {
                document.addEventListener('click', this.handleClickOutSide, false)
            } else {
                document.removeEventListener('click', this.handleClickOutSide, false)
            }
        }
    }
    handleClickOutSide(e) {
        if(this.state.target.contains(e.target)) {
            this.props.onClose(false);
            return null;
        }

        this.props.onClose(true)
    }
    shouldComponentUpdate(nextProps, nextState){
        return this.props.isOpen!==nextProps.isOpen||this.state.target!==nextState.target||this.state.popOverClass!==nextState.popOverClass;
    }
    render() {
        return (
            <div className={"_popover-container " +this.state.popOverClass ? this.state.popOverClass : ""}>
                {this.props.isOpen && this.props.children}
            </div>
        )
    }
}