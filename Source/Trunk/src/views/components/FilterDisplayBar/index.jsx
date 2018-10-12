import React, {Component} from 'react';
/**
 * Filter phiên bản simple
 * Author: Justin
 * Date: 2018-06-12
 */
class FilterBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // console.log('display filter bar', this.props.items);
        if (this.props.items && this.props.items.length > 0)
            return (
                <div className="filter__tag mgt10">
                    <ul>
                        {this.props.items.map((item, index) => {
                            // noinspection JSRemoveUnnecessaryParentheses
                            // noinspection CheckTagEmptyBody
                            // console.log('item...display', item);
                            return <li className="fll bg-color-blue2 position-re mgr10 mgbt10" style={item.color ? {backgroundColor: item.color} : {}} key={index}>
                                <span className={`dpl-il-block txt-size-h6 txt-color-blue2 openSans-regular`} style={item.color ? {color: '#fff'} : {}}>
                                    {item.text}
                                </span>
                                    {
                                        this.props.fieldNotShowRemove
                                        ?
                                            this.props.fieldNotShowRemove.filter(x => x === item.field)[0]
                                            ?
                                            null
                                            :
                                            <a onClick={(e) => this.props.onRemoveItem({...item, index: index})} className="position-ab cursor-pointer">
                                                <i className="material-icons txt-size-h7 txt-color-blue">
                                                    close
                                                </i>
                                            </a>
                                        :
                                        <a onClick={(e) => this.props.onRemoveItem({...item, index: index})} className="position-ab cursor-pointer">
                                            <i className="material-icons txt-size-h7 txt-color-blue">
                                                close
                                            </i>
                                        </a>
                                    }

                            </li>
                        })}
                        <li className="_clearFilter fll bg-color-red2 position-re mgr10 mgbt10 cursor-pointer" onClick={this.props.clearFilter}>
                          <span className="dpl-il-block txt-size-h6 txt-color-red openSans-regular">
                            Xóa bộ lọc
                          </span>
                            <a className="position-ab">
                                <i className="material-icons txt-size-h7 txt-color-red">
                                    close
                                </i>
                            </a>
                        </li>
                    </ul>
                </div>
            );
        return <div className="filter__tag mgt10" />
    }
}

FilterBar.defaultProps = {
    items: []
};

export default FilterBar;