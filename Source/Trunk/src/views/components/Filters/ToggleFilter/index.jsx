import React, { Component } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { FilterUtils } from "../../../../utils/filterUtils";
import * as _ from 'lodash';
export default class ToggleFilter extends Component {
    static defaultProps = {
        name: '',
        items: [],
        className: '',
        filter: {},
        field: '',
        fieldName: '',
        textProperty: 'name',
        valueProperty: 'id',
        selectToSearch: true,
        onChanged: (e, cond) => { },
        onFilterChanged: (filter) => { },
    };

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            active: [],
            activeValue: [],

        }
    }
    componentWillMount() {
        let active = [];
        let activeValue = [];
        FilterUtils.getFilterDisplay(this.props.filter).forEach((item, index) => {
            if (item.name === this.props.field) {
                active.push(item);
                activeValue.push(Number(item.value));
            }
        });
        this.setState({
            active: active,
            activeValue: activeValue,
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.filter !== this.props.filter) {
            let active = [];
            let activeValue = [];
            FilterUtils.getFilterDisplay(nextProps.filter).forEach(item => {
                if (item.name === this.props.field) {
                    active.push(item);
                    activeValue.push(Number(item.value));
                }
            });
            this.setState({
                active: active,
                activeValue: activeValue,
            });
        }
    }
    onItemSelected = (items) => {
        if (!this.props.selectToSearch) {
            return
        }

        this.props.onChanged(this, this.getFilter([items]));
    };

    getFilter = (items) => {
        if (items.length > 0) {
            return { [this.props.field]: items[0][this.props.valueProperty] }
        }
        else return null;
    };

    onChange = (e, item) => {
        if ((e.target.className).indexOf("active") > -1) {
            // Thêm filter
            this.onItemSelected(item);
        } else {
            // Xóa filter
            const remove = this.state.active.find(isRemove => Number(isRemove.value) === item.id);
            const obj = remove.index? {
                field: this.props.field,
                name: this.props.name,
                text: item.name,
                value: item.id,
                index: remove.index,
            }:{
                field: this.props.field,
                name: this.props.name,
                text: item.name,
                value: item.id,
            };
            this.handleRemoveItem(obj);
        }
    };
    // Function xóa filter
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
                        condObj['or'].splice(item.index, 1);
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
    render() {
        return  <div className="toggle-filter">
                    <span className="name-text">{this.props.name} </span>
                    {this.props.items.map((item, n) => {
                        const active = this.state.activeValue.indexOf(item.id)>-1 ? "active":"";
                        const _style = `_${this.props.field}-${item.id}`
                        const style = `item-button-group ${active}`;
                        return (
                            <ToggleButtonGroup type="checkbox" key={n} className={_style}>
                                <ToggleButton
                                    value={item.id}
                                    onClick={(e) => this.onChange(e, item)}
                                    className={style}
                                    data-tip={item.name}
                                >
                                    {item.key}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        );
                    })}
                </div>
    }
}