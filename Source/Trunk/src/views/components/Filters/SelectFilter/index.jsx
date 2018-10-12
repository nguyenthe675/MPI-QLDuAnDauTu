import React, {Component} from "react";
import Select from "../../Select";

export default class SelectFilter extends Component {
    static defaultProps = {
        name: '',
        unselectedText: '',
        removeText: '',
        allowRemove: true,
        field: '',
        fieldName: '',
        op: 'eq',
        filter: {},
        items: [],
        textProperty: 'name',
        valueProperty: 'id',
        allowFilter: true,
        selectToSearch: true,
        onChanged: (e, cond) => {},
    };

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    onItemSelected=(items)=> {
        if (!this.props.selectToSearch) {
            return
        }

        this.props.onChanged(this, this.getFilter(items));
    };

    getFilter = (items)=> {
        if (items.length > 0) {
            return { [this.props.field] : items[0][this.props.valueProperty]}
        }
        else return null;
    };

    render() {
        return <Select
            className={this.props.className}
            textClassName={this.props.textClassName}
            iconDropDown={this.props.iconDropDown}
            name={this.props.name}
            unselectedText={this.props.unselectedText}
            removeText={this.props.removeText}
            field={this.props.field}
            fieldName={this.props.fieldName}
            op={this.props.op}
            items={this.props.items}
            textProperty={this.props.textProperty}
            valueProperty={this.props.valueProperty}
            allowFilter={this.props.allowFilter}
            allowRemove={this.props.allowRemove}
            onItemSelected={this.onItemSelected}
        />
    }
}