import React, { Component } from "react";
import './style.scss'
import { FilterUtils } from "../../../utils/filterUtils";

export default class TextInputFilter extends Component {
    static defaultProps = {
        enterToSearch: true,
        blurToSearch: true,
        placeholder: '',
        name: '',
        fieldName: '',
        field: '',
        op: 'eq',
        wildcardStart: false,
        wildcardEnd: false,
        onChanged: (e, cond) => { },
        resetOnChanged: true,
        getValueFromFilter: true,
        value: '',
        filter: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            value: null
        }
    }

    onChanged = () => {
        this.props.onChanged(this, this.getFilter());
        if (this.props.resetOnChanged) {
            this.setState({ value: null });
        }
    };

    handleTextBoxKeyUp = (e) => {
        if (!this.props.enterToSearch) {
            return;
        }

        let keyCode = e.keyCode;
        if (keyCode === 13) {
            this.onChanged();
        }
    };

    handleTextBoxOnBlur = (e) => {
        if (!this.props.blurToSearch) {
            return;
        }

        this.onChanged();
    };

    getFilter = () => {
        let value = this.getValue();

        if (!value) return null;

        if (this.props.wildcardStart) {
            value = '%' + value;
        }

        if (this.props.wildcardEnd) {
            value = value + '%';
        }

        return {
            [this.props.field]: {
                [this.props.op]: value
            }
        }
    };

    getValue = () => {
        if (this.state.value !== null) {
            return this.state.value;
        }

        if (this.props.getValueFromFilter) {
            let find = FilterUtils.findFieldValue(this.props.filter, this.props.field);
            return find || this.props.value;
        }

        return this.props.value;
    };

    shouldComponentUpdate(nextProps, nextState) {
        //only value should change, if anything else change, this will cause error
        return this.props.value !== nextProps.value
            || this.state.value !== nextState.value
            || JSON.stringify(this.props.filter) !== JSON.stringify(nextProps.filter)
    }

    render() {
        return (
            <div className="filter__ip position-re">
                {
                    this.props.regex
                        ?
                        <input
                            type="text"
                            key={'input'}
                            name={this.props.name}
                            className={`${this.props.className} form-control`}
                            placeholder={this.props.placeholder}
                            value={this.getValue()}
                            onChange={(e) => { this.setState({ value: e.target.value.replace(this.props.regex, '') }) }}
                            onKeyUp={this.handleTextBoxKeyUp}
                            onBlur={this.handleTextBoxOnBlur}
                        />
                        :
                        <input
                            type="text"
                            key={'input'}
                            name={this.props.name}
                            className={`${this.props.className} form-control`}
                            placeholder={this.props.placeholder}
                            value={this.getValue()}
                            onChange={(e) => { this.setState({ value: e.target.value }) }}
                            onKeyUp={this.handleTextBoxKeyUp}
                            onBlur={this.handleTextBoxOnBlur}
                        />
                }

                <span className="position-ab txt-size-h2 txt-color-black2">
                    <i className="fas fa-search" />
                </span>
            </div>
        )
    }
}