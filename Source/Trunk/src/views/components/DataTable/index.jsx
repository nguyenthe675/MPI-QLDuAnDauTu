import React, {Component} from 'react'
import DataRow from "./DataRow";
import moment from "moment/moment";

class DataTable extends Component {
    // noinspection JSUnusedLocalSymbols
    static defaultProps = {
        name: 'table',
        data: [],
        visibleColumns: [],
        columnStyles: {},
        columnHeaders: {},
        sortable:[],
        headerStyles: {},
        emptyData: '',
        renderCell: (cell)=> {
            return null;
        },
        renderCellContent: (cell) => {
            return null;
        },
        renderCustomRow: () => {
            return null;
        },
        renderRowClass: () => {},
        showCheckbox: true,
        showSetting: true,
        contextMenu: false,
        striped: false,
        error: '',
        onCheckboxChanged: (selectedItems) => {},
        onSort: (order)=> {},
        sorting: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            selectedIndexes: [],
            isSelectAll: false,
            contextMenuShowIndex: -1
        };
    }


    componentDidMount() {
        if(this.props.hasOwnProperty('setRef') && typeof this.props.setRef === 'function') {
            this.props.setRef(this);
        }
    }


    componentWillUnMount() {
        if(this.props.hasOwnProperty('setRef') && typeof this.props.setRef === 'function') {
            this.props.setRef(this);
        }
    }

    resetSelection=()=> {
        this.setState({selectedIndexes: [], isSelectAll: false}, ()=> {
            this.props.onCheckboxChanged([]);
        });
    };

    renderCell = (cell)=> {
        try {
            let rendered = this.props.renderCell(cell);
            if (rendered == null) {
                return <td className={`_${cell.columnName}`}
                           key={cell.columnIndex}
                           style={this.props.columnStyles[cell.columnName] ? this.props.columnStyles[cell.columnName] : {}}
                >
                    {this.props.renderCellContent(cell) || this.formatValue(cell.value)}
                </td>
            }
            return rendered;
        }
        catch (err) {
            console.error(err);
            return <td>!Error!</td>
        }
    };

    formatValue= (value)=> {
        if (typeof value === 'string' && moment(value).isValid()) {
            return value ? moment(value).format('HH:mm DD/MM/YYYY') : '';
        }

        return value;
    };

    isSelected= (index)=> {
        return this.state.selectedIndexes.indexOf(index) > -1;
    };

    checkboxClick = (index)=> {
        let found = this.state.selectedIndexes.indexOf(index);
        let result;
        if (found === -1) {
            result = [...this.state.selectedIndexes, index];
        }
        else {
            result = [...this.state.selectedIndexes];
            result.splice(result.indexOf(index), 1);
        }

        //if none selected then select all is false
        let isSelectAll = result.length !== 0;

        this.setState({selectedIndexes: result, isSelectAll: isSelectAll});
        this.props.onCheckboxChanged(this.getSelectedItems(result));
    };

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            // TODO: Khong hieu doan nay, kha nguy hiem vi auto trieu hoi
            // this.resetSelection();
        }
    }

    checkboxAllClick = () => {
        if (this.state.isSelectAll) {
            this.clearSelected();
        }
        else {
            let result = [];
            for (let index in this.props.data) {
                // noinspection JSUnfilteredForInLoop
                result.push(parseInt(index, 10));
            }
            this.setState({isSelectAll: true, selectedIndexes: result});
            this.props.onCheckboxChanged(this.getSelectedItems(result));
        }
    };

    clearSelected() {
        this.setState({isSelectAll: false, selectedIndexes: []});
        this.props.onCheckboxChanged([]);
    }

    getSelectedItems(indexes) {
        let result =[];

        for (let index of indexes) {
            result.push(this.props.data[index]);
        }

        return result;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
        || JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)
        || JSON.stringify(this.props.visibleColumns) !== JSON.stringify(nextProps.visibleColumns)
        || JSON.stringify(this.state.selectedIndexes) !== JSON.stringify(nextState.selectedIndexes)
        || this.state.isSelectAll !== nextState.isSelectAll
        || this.props.error !== nextProps.error
        || this.props.currentItem !== nextProps.currentItem
        || this.props.sorting !== nextProps.sorting
    }

    sort = (columnName) => {
        if (this.props.sorting && this.props.sorting === columnName + ' ASC') {
            this.props.onSort(this,columnName + ' DESC');
        }
        this.props.onSort(this, columnName + ' ASC');
    };

    renderSortingIcon(columnName) {
        if (this.props.sorting === columnName + ' ASC') {
            return <i className="cursor-pointer fas fa-sort-amount-down" />
        }
        else if (this.props.sorting === columnName + ' DESC') {
            return <i className="cursor-pointer fas fa-sort-amount-up" />
        }
        return <i className="cursor-pointer fas fa-sort"/>
    }

    renderHeader= (columnName, index)=> {
        let style = this.props.columnStyles[columnName]
            ? this.props.columnStyles[columnName]
            :{};
        if (this.props.sortable.indexOf(columnName)> -1) {
            return <th className="sortable position-re" key={index} style={style} onClick={()=> this.sort(columnName)} scope="col">
                <span className={'whitespace'}>
                    {this.props.columnHeaders[columnName] || columnName} {this.renderSortingIcon(columnName)}
                </span>
            </th>
        }
        return <th key={index} style={style} className={'position-re'} scope="col">
                {this.props.columnHeaders[columnName] || columnName}
            </th>
    };

    onContextMenu= (e, item, index)=> {
        if (this.props.contextMenu) {
            e.preventDefault();
            let mousePos = this.getMousePosition(e);

            let target = {left: 0};
            let elm = e.target;

            while (elm && elm.tagName !== 'TD') {
                if (!elm.parentElement) {
                    return true;
                }
                elm = elm.parentElement;
            }

            if (elm.tagName === 'TD') {
                target = elm.parentElement.getBoundingClientRect();
            }

            let state = {contextMenuShowIndex: index, contextRight: null, contextLeft: mousePos.x + 10 - target.left + window.scrollX};
            let width = window.innerWidth;
            if (mousePos.x > width*2/3) {
                state.contextLeft = null;
                state.contextRight = - target.right + target.left + 15 + (width -mousePos.x);
            }

            if (index + 1 > this.props.data.length / 2) {
                state.contextBottom = '10px';
            } else {
                state.contextBottom = null;
            }

            this.setState(state);
            return false;
        }
    };

    getMousePosition=  (e)=> {
        e = e || window.event;
        return {
            'x': e.clientX,
            'y': e.clientY
        }
    };

    getContextMenuStyle = ()=> {
        let style = {};
        if (this.state.contextLeft) {
            style.right = 'auto';
            style.left = this.state.contextLeft;
        }
        if (this.state.contextRight) {
            style.left = 'auto';
            style.right = this.state.contextRight;
        }
        if (this.state.contextBottom) {
            style.top = 'auto';
            style.bottom = this.state.contextBottom;
        }
        return style;
    };

    renderRow=(item, index)=> {
        const classname = '_table-row ' + this.props.renderRowClass(item);
        try {
            let rendered = this.props.renderCustomRow(item, index);
            if (rendered == null) {
                return <DataRow
                    key={index}
                    name={this.props.name}
                    index={index}
                    item={item}
                    showCheckbox={this.props.showCheckbox}
                    isContextMenuShow={this.state.contextMenuShowIndex === index}
                    onContextMenuClose={()=> {this.setState({ contextMenuShowIndex: -1, contextBottom: null, contextLeft: null })}}
                    contextMenu={this.props.contextMenu}
                    renderCell={this.renderCell}
                    visibleColumns={this.props.visibleColumns}
                    checkBoxClick={()=>this.checkboxClick(index)}
                    isSelected={this.isSelected}
                    contextMenuClick={()=>{this.setState({contextMenuShowIndex: index, contextRight: null, contextLeft: null})}}
                    getContextMenuStyle={this.getContextMenuStyle}
                    onContextMenu={(e)=> {return this.onContextMenu(e, item, index)}}
                    className={classname}
                    columnStyles={this.props.columnStyles}
                />
            }
            return rendered;
        } catch (e) {
            return e
        }
    };

    renderEmptyOrError=()=> {
        return <tr><td
            colSpan={this.props.visibleColumns.length + ((this.props.showCheckbox || this.props.showSetting) ? 1: 0)}
            className={this.props.error ? 'error': ''}>
            {this.props.error || this.props.emptyData}</td></tr>
    };

    getCheckboxAllState= ()=> {

        if (!this.state.isSelectAll || !this.state.selectedIndexes.length) {
            return 'far fa-square';
        }

        if (this.state.selectedIndexes.length < this.props.data.length) {
            return 'far fa-minus-square';
        }

        if(!this.props.data.length) {
            return 'far fa-square';
        }

        return 'fa fa-check-square green';
    };

    render() {
        //TODO: write pop-over without component will receive props

        return (
            <div className="contenttable">
                <div className="table-responsive">
                    <table className={`table ${this.props.className || ''}`}>
                        <thead className="thead-gray">
                            <tr className="table-heading">
                                {(this.props.showCheckbox || this.props.showSetting || this.props.contextMenu) &&
                                <th className="action-column position-re" scope="col">
                                    {this.props.showCheckbox &&
                                    <i onClick={() => {
                                        this.checkboxAllClick()
                                    }} className={`_checkbox_all pointer ${this.getCheckboxAllState()}`} style={{marginRight: 5}}/>}
                                    {this.props.showSetting && <i className="fa fa-cog"/>}
                                </th>}
                                {this.props.visibleColumns.map(this.renderHeader)}
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.data.length > 0 ? this.props.data.map(this.renderRow) : this.renderEmptyOrError()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

export default DataTable