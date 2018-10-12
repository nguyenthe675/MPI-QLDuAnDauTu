import React, { Component } from "react";
import Popover from "../../../../utils/Popover";
import lang from '../../../../resources/localization/Localization';
import {translate} from 'react-i18next';
import {connect} from "react-redux";

class NumberFilter extends Component {
    static defaultProps = {
        name: '',
        className: '',
        field: '',
        fieldName: '',
        textProperty: 'name',
        valueProperty: 'id',
        selectToSearch: true,
        onChanged: (e, cond) => { },
    };

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            start: 0,
            end: 0,
            math: t(lang.contact.equal),
            isShow: false,
            error: '',
        }
    }
    onItemSelected = (state) => {
        if (!this.props.selectToSearch) {
            return
        }

        this.props.onChanged(this, this.getFilter(state));
    };

    getFilter = (state) => {
        const {t} = this.props;
        if (state.math === t(lang.contact.equal)) {
            return {
                [this.props.field]: state.start
            };
        } else if (state.math === t(lang.contact.more)) {
            return {
                [this.props.field]: {gte : state.start}
            }
        } else if (state.math === t(lang.contact.less)) {
            return {
                [this.props.field]: {lte : state.start}
            }
        } else {
            if(state.start <= state.end) {
                return {[this.props.field]: {between: [state.start,state.end]}}
            } else {
                return {[this.props.field]: {between: [state.end,state.start]}}
            }
        }
    };
    onChange = (event) => {
        this.setState({
            math: event.target.value,
            start: 0,
            end: 0,
            error: '',
        });
    }
    onClick = (e) => {
        this.setState({ isShow: !this.state.isShow }, () => {
            if (this._popup) {
                this._popup.focus();
            }
        });
    };
    inputChange = (event) => {
        const field = event.target.name;
        this.setState({
            [field]: event.target.value,
            error: '',
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        const {t} = this.props;
        if (Number.isInteger(Number(this.state.start)) && Number.isInteger(Number(this.state.end))) {
            if (this.state.start >= 0 && this.state.end >= 0) {
                if (this.state.start >= 100 || this.state.end >= 100) {
                    this.setState({
                        error: t(lang.contact.shoul_input_less_than_100),
                    });
                }else if (this.state.math === t(lang.contact.less) && Number(this.state.start) === 0) {
                    // console.log(this.state);
                    this.setState({
                        error: t(lang.contact.greater_than_or_equal_1),
                    });
                } else {
                    this.onItemSelected(this.state);
                    this.setState({
                        start: 0,
                        end: 0,
                        math: t(lang.contact.equal),
                        isShow: false,
                        error: '',
                    });
                }
            } else {
                this.setState({
                    error: t(lang.contact.greater_than_or_equal_0),
                })
            }
        } else {
            this.setState({
                error: t(lang.contact.value_integer),
            })
        }
        
    }
    render() {
        const {t} = this.props;
        const maths = [t(lang.contact.equal), t(lang.contact.more), t(lang.contact.less), t(lang.contact.between)];
        return <span id={`_${this.props.field}`} className={`select-control ${this.props.className}` + (this.state.isShow ? ' active' : '')}>
            <span onClick={this.onClick} className="title">
                {this.props.name} <i className="fa fa-angle-down"></i>
            </span>
            <Popover
                isOpen={this.state.isShow}
                onClose={(_state) => { this.setState({ isShow: !_state }) }}
                target={`_${this.props.field}`}
                popOverClass={this.props.popOverClass}
            >
                <div className="popup-container" ref={(ref) => { this._popup = ref }}>
                    <form onSubmit={this.onSubmit}>
                    <label>{t(lang.contact.search)}:</label>
                    {this.state.error && <p className="text-danger">{this.state.error}</p>}
                        <select className="form-control" value={this.state.math} onChange={this.onChange}>
                            {maths.map((item, n) => {
                                return (
                                    <option
                                        className="option"
                                        key={n}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                        {this.state.math !== t(lang.contact.between) ?
                            <div className="number">
                                <label>{t(lang.contact.input_number)}:</label>
                                <input className="form-control" name="start" type="number" value={this.state.start} onChange={this.inputChange} required/>
                            </div> :
                            <div className="number">
                                <label>{t(lang.contact.from)}:</label>
                                <input className="form-control" name="start" type="number" value={this.state.start} onChange={this.inputChange} required/>
                                <label>{t(lang.contact.to)}:</label>
                                <input className="form-control" name="end" type="number" value={this.state.end} onChange={this.inputChange} required/>
                            </div>
                        }
                        <button className="btn btn-primary submit" type="submit">OK</button>
                    </form>
                </div>
            </Popover>
        </span>
    }
}
export default connect()(translate()(NumberFilter));