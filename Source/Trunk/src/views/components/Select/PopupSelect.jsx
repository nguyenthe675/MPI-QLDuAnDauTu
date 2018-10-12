import React, {Component} from 'react'

class PopupSelect extends Component {
    static defaultProps = {
        textProperty: 'name',
        items: [],
        allowFilter : true,
        allowRemove: true,
        // removeText: "-- Empty --",
        isCaseInsensitive: true,
        onShow: ()=> {},
        onItemSelected: ()=> {},
        title: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            selectedItem: props.selectedItem,
        };
    }

    onSelect(item) {
        this.setState({selectedItem: item}, ()=> {
            this.props.onItemSelected(item)
        });
    }

    onKeyUp =(e) => {
        this.setState({filter: e.target.value});
    };

    shouldDisplay = (item) => {
        if (!this.state.filter) return true;

        if (!item[this.props.textProperty]) return false;

        if (this.props.isCaseInsensitive) {
            return item[this.props.textProperty].toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
        }
        return item[this.props.textProperty].indexOf(this.state.filter) > -1;
    };

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items)
            || this.state.filter !== nextState.filter
            || this.state.selectedItem !== nextState.selectedItem;
    }

    focus= ()=> {
        if (this._filterInput) {
            this._filterInput.focus();
        }
    };

    isSelected= (item)=> {
        return this.state.selectedItem == item;
    };

    render() {
        // console.log('PopupSelect', this.props);
        const {field} = this.props;
        return (
            <div className="popup-container">
                <div className="popup-inner">
                    { this.props.title && <div className="heading">
                        {this.props.title}
                    </div>}
                    <div className="body">
                        {this.props.allowFilter && <div className="popup-search-input">
                            <input type="text" className={`_${field}SelectInput form-control`} placeholder="" onKeyUp={this.onKeyUp} ref={(ref)=> {this._filterInput = ref}}/>
                        </div>}

                        <ul className={`_${field}SelectBox list-unstyled ul-select-list`}>
                            {/* { this.props.allowRemove && <li key={-1} className={"select-list-item"}
                                                            onClick={(e)=> {this.onSelect(null)}}
                            >{this.props.removeText}</li>} */}
                            {Array.isArray(this.props.items) && this.props.items.map((item, index) => this.shouldDisplay(item) && (
                                <li key={index} className={`_${field}SelectItem select-list-item ${this.props.showSelected && this.isSelected(item) && "selected"}`}
                                    onClick={(e) => {this.onSelect(item)}}>
                                    {item[this.props.textProperty]}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopupSelect