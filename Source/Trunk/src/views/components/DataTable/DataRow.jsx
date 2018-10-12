import React, { Component } from 'react'
import Popover from "../../utils/Popover";

export default class DataRow extends Component {
    // noinspection JSUnusedLocalSymbols
    static defaultProps = {
        name: '',
        index: -1,
        item: null,
        showCheckbox: false,
        showSetting: false,
        checkBoxClick: (index) => { },
        contextMenuClick: (index) => { },
        isSelected: (index) => { return false; },
        isContextMenuShow: false,
        onContextMenuClose: (e) => { },
        contextMenu: false,
        renderCell: (item) => { },
        visibleColumns: [],
        getContextMenuStyle: () => { return {}; },
        className: '',
        columnStyles: null
    };

    getValue(item, column) {
        if (column.indexOf('.') === -1)
            return this.props.item[column];
        else {
            let obj = item;
            let fields = column.split('.');
            for (let field of fields) {
                obj = obj[field];
            }

            return obj;
        }
    }

    getClassName() {
        let className = this.props.className ? this.props.className : '';

        if (this.props.isContextMenuShow) {
            className += ' highlight';
        }
        return className;
    }

    render() {
        return <tr
            className={this.getClassName()}
            id={`_${this.props.name}_row_${this.props.index}`}
            key={this.props.index}
            onContextMenu={this.props.onContextMenu}
        >
            {(this.props.showCheckbox || this.props.showSetting) && <th className="action-column">
                {this.props.showCheckbox && <i onClick={(e) => { this.props.checkBoxClick() }} className={`_checkbox pointer ${this.props.isSelected(this.props.index) ? 'fa fa-check-square green' : 'far fa-square'}`} />}
                {this.props.contextMenu && <i onClick={this.props.contextMenuClick} className="_context_menu pointer context_menu fa fa-ellipsis-v" />}
                {this.props.contextMenu && (
                    <Popover
                        isOpen={this.props.isContextMenuShow}
                        onClose={this.props.onContextMenuClose}
                        target={`_${this.props.name}_row_${this.props.index}`}
                        popOverClass="context-menu-over"
                    >
                        <div className="context-menu-container" style={this.props.getContextMenuStyle()}>
                            {this.props.contextMenu(this.props.item)}
                        </div>
                    </Popover>)}
            </th>}
            {this.props.visibleColumns.map((column, columnIndex) => {
                return this.props.renderCell({ item: this.props.item, value: this.getValue(this.props.item, column), columnName: column, columnIndex: columnIndex, rowIndex: this.props.index });
            })}
        </tr>
    }
}