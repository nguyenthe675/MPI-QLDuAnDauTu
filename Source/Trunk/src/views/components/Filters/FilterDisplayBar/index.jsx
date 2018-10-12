import React, {Component} from "react";
import './style.scss'
import lang from '../../../../resources/localization/Localization';
import {connect} from "react-redux";
import {translate} from 'react-i18next';
import {FilterUtils} from "../../../../utils/filterUtils";

import * as _ from 'lodash';
class FilterDisplayBar extends Component {
    static defaultProps = {
        filter: {},
        onFilterChanged: (filter)=> {},
        fields: {},
        fieldValues: {},
        showTitle: true,
        fieldsClasses: {},
        clearFilter:() => {},
    };

    getFilterDisplay=()=> {
        return FilterUtils.getFilterDisplay(this.props.filter, this.props.fields, this.props.fieldValues);
    };

    handleRemoveItem(item) {
        if (!this.props.filter.where || !this.props.filter.where.and) {
            return;
        }

        let filter = _.cloneDeep(this.props.filter);
        let found = false;
        let conArray = filter.where.and || [];

        let condObj = null;
        for (let index in conArray) {
            let field = FilterUtils.getFieldKey(conArray[index]);
            if (field === item.field) {
                found = true;
                //found him
                condObj = conArray[index];

                let keys = Object.keys(condObj);
                if (keys[0] === 'or') {
                    if (condObj['or'].length > 1) {
                        condObj['or'].splice(item.index,1);
                    }
                    else {
                        conArray.splice(index, 1);
                    }
                }
                else if (keys[0] === 'and') {
                    conArray.splice(index, 1);
                }
                else {
                    conArray.splice(index, 1);

                }
            }
        }

        if (filter.where.and.length === 0) {
            delete filter.where.and;
        }

        if (found) {
            filter.skip = 0;
        }

        this.props.onFilterChanged(filter);
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps.filter) !== JSON.stringify(this.props.filter)
            || JSON.stringify(nextProps.fields) !== JSON.stringify(this.props.fields)
            || JSON.stringify(nextProps.fieldValues) !== JSON.stringify(this.props.fieldValues)
            || nextProps.showTitle !== this.props.showTitle
    }

    getShowTitle(name) {
        if (this.props.showTitle) {
            if (typeof this.props.showTitle === 'object') {
                return this.props.showTitle[name] !== false;
            }
            return true;
        }
        return false;
    }

    render() {
        const {t} = this.props;

        // console.log('translate', t);

        let filterDisplay = this.getFilterDisplay();
        return (filterDisplay.length > 0 ? <div className="filter-values">
                {filterDisplay.map((filter,index) => {
                    // noinspection JSRemoveUnnecessaryParentheses
                    // noinspection CheckTagEmptyBody
                    return <div key={index} className={"value-item" + (this.props.fieldsClasses[filter.field] ? ` filter-${filter.value.toLowerCase()}`: '')}>
                        {(!this.getShowTitle(filter.field) ? '': filter.name + ': ') +filter.text}&nbsp;
                        <i className="fa fa-close" onClick={(e) => {
                            this.handleRemoveItem(filter)
                        }}></i>
                    </div>
                })}
                <span className="clear-filter pointer filter-control" onClick={this.props.clearFilter}>
                    <i className="fa fa-close"/> {t(lang.contact.clear)}
                    </span>
                <hr className="hr-contact-2"/>
            </div>: null
        )
    }
}
export default connect()(translate()(FilterDisplayBar));