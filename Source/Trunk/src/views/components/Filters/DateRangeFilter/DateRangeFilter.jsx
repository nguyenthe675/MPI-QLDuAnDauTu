/**
 * create by Taobao dev team 18/1/2018
 */
import React, {Component} from 'react'
import moment from "moment/moment";
import {DateRangePicker} from "react-bootstrap-daterangepicker";

export default class DateRangeFilter extends Component {

    static defaultProps = {
        selectToSearch: true,
        placeholder: '',
        name: '',
        field: '',
        maxDate: null,
        minDate:null,
        onChanged: (e, newFilter) => {},
        initialDateFrom: null,
        initialDateTo: null,
        dateFormat: 'MM/DD/YYYY'
    };

    static defaultState = {
        dateFrom: false,
        dateTo: false,
        isShowDateRangePicker: false
    };

    constructor(props) {
        super(props);
        this.state = {...this.defaultState};
    }

    onApplyDatePicker(e, picker) {
        let dateFrom = picker.startDate.format("YYYY-MM-DD");
        let dateTo = picker.endDate.format("YYYY-MM-DD 23:59:59");

        this.setState({
            dateFrom: dateFrom,
            dateTo: dateTo
        }, ()=> {
            this.props.onChanged(this, this.getCond());
        });
    }

    getCond = () => {
        if (this.state.dateFrom && this.state.dateTo) {
            return {
                [this.props.field]: {
                    between: [this.state.dateFrom, this.state.dateTo]
                }
            };
        }

        return null;
    };

    reset(callback) {
        this.setState({...DateRangeFilter.defaultState}, ()=> {
            if (callback) {
                callback();
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState);
        //return this.state.value !== nextState.value;
    }

    getDateFrom= ()=> {
        let date = this.props.dateFrom || this.state.dateFrom;
        return date ? moment(date).format(this.props.dateFormat) : moment().format(this.props.dateFormat)
    };

    getDateTo= ()=> {
        let date = this.props.dateTo || this.state.dateTo;
        return date ? moment(date).format(this.props.dateFormat) : moment().format(this.props.dateFormat)
    };

    render() {
        return (
            <DateRangePicker
                className={this.props.className}
                startDate={this.getDateFrom()}
                endDate={this.getDateTo()}
                maxDate={this.props.maxDate}
                onApply={(e, picker) => this.onApplyDatePicker(e, picker)}
                onShowCalendar={() => {console.info('show'); this.setState({isShowDateRangePicker: true})}}
                onHideCalendar={() => {console.info('hide'); this.setState({isShowDateRangePicker: false})}}
                dateFormat={this.props.dateFormat}
            >
            <span id={`_${this.props.field}`} className={"pointer filter-control" + (this.state.isShowDateRangePicker ? ' active': '')}>
                <span className="title">{this.props.placeholder} <i className="fa fa-calendar" /></span>
            </span>
            </DateRangePicker>
        )
    }
}