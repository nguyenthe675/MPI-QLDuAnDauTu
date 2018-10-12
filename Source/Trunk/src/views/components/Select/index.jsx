import React, {Component} from 'react'
import Popover from "../../utils/Popover";
import PopupSelect from "./PopupSelect";
import './style.scss'

class Select extends Component {
    static defaultProps = {
        className: '',
        name: '',
        items: [],
        unselectedText: 'Unassign',
        removeText: '-- Empty --',
        popupTitle: '',
        selectedItems: [], //default selected
        selectedValues: [], //default selected
        textProperty: 'name',
        valueProperty: 'id',
        allowFilter: true,
        allowRemove: true,
        resetOnChanged: true,
        showSelected: false,
        onItemSelected: (item) => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            selectedItems: null
        };
    }

    // componentDidUpdate() {
    //     let selectedItems = [];
    //     if (this.props.selectedItems) {
    //         if (Array.isArray(this.props.selectedItems)) {
    //             selectedItems = this.props.selectedItems;
    //         }
    //         else {
    //             selectedItems = [this.props.selectedItems];
    //         }
    //     }
    //
    //     this.setState({
    //         selectedItems: selectedItems
    //     })
    // }

    get SelectedItems() {
        if (this.state.selectedItems === null) {
            if (this.props.selectedItems && this.props.selectedItems.length > 0) {
                if (Array.isArray(this.props.selectedItems)) return this.props.selectedItems;
                return [this.props.selectedItems];
            }

            if (this.props.selectedValues && this.props.selectedValues.length > 0) {
                if (this.props.items) {
                    let selected = [];
                    for (let item of this.props.items) {
                        for (let v of this.props.selectedValues)
                        if (item[this.props.valueProperty] === v) {
                            selected.push(item);
                        }
                    }

                    return selected;
                }
            }

            return [];
        }
        return this.state.selectedItems;
    }

    onClick = (e)=> {
        this.setState({isShow: !this.state.isShow}, () => {
            if (this._popup) {
                this._popup.focus();
            }
        });
    };

    displayText = () => {
        let selectedItems = this.SelectedItems;
        if (selectedItems.length > 0) {
            return selectedItems[0][this.props.textProperty];
        }
        return this.props.unselectedText;
    };

    onItemSelected = (items)=> {
        let selected = [];
        if (items) {
            selected.push(items);
        }
        this.setState({isShow: false, selectedItems: this.props.resetOnChanged ? null : selected}, ()=> {
            //TODO: hỗ trợ select nhiều item
            this.props.onItemSelected(selected);
        })
    };

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items)
            || JSON.stringify(this.state.selectedItems) !== JSON.stringify(nextState.selectedItems)
            || JSON.stringify(this.props.selectedValues) !== JSON.stringify(nextProps.selectedValues)
            || this.state.isShow !== nextState.isShow
            || this.props.unselectedText !== nextProps.unselectedText
    }

    render() {
        let id = this.props.name;
        return (
            <span id={`_${id}`} className={`select-control ${this.props.className}` + (this.state.isShow ? ' active' : '')}>
                <span onClick={this.onClick} className={`title ${this.props.textClassName}`}>
                    {this.displayText()}
                    {
                        this.props.iconDropDown
                        ?
                        this.props.iconDropDown
                        :
                        <i className="fa fa-angle-down" />
                    }
                </span>
                <Popover
                    isOpen={this.state.isShow}
                    onClose={(_state) => {this.setState({isShow: !_state})}}
                    target={`_${id}`}
                    popOverClass={this.props.popOverClass}
                >
                    <PopupSelect
                        ref = {(ref) => {this._popup = ref}}
                        items={this.props.items}
                        title={this.props.popupTitle}
                        selectedItem = {this.SelectedItems.length > 0 ? this.SelectedItems[0] : null}
                        field={this.props.field}
                        valueProperty={this.props.valueProperty}
                        textProperty = {this.props.textProperty}
                        removeText = {this.props.removeText}
                        allowFilter = {this.props.allowFilter}
                        allowRemove = {this.props.allowRemove}
                        showSelected={this.props.showSelected}
                        onItemSelected={this.onItemSelected}
                    />
                </Popover>
            </span>
        )
    }

// <Select
// name="campaign"
// unselectedText={t(lang.contact.campaign)}
// field="campaignId"
// items = {this.state.campaigns}
// filter = {this.filter.bind(this)}
// popupTitle = {"List of campaign"}
// selectedValues ={[203]}
// >
}

export default Select