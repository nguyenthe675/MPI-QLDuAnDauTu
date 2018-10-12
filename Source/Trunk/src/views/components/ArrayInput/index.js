import React from 'react'
import {fromJS} from 'immutable'
export default class index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            arrayData: fromJS([
                {
                    id: 0,
                    value: '',
                    isEdit: true
                }
            ])
        }
    }

    componentDidMount () {
        let {arrayData} = this.props;
        if(Array.isArray(arrayData)) {
            if (typeof arrayData[0] !== 'object') {
                let newArray = [];
                arrayData.map((item, index) => {
                    newArray.push({
                        id: index,
                        value: item
                    })
                });
                this.setState({
                    arrayData: fromJS(newArray)
                })
            } else {
                this.setState({
                    arrayData: fromJS(arrayData)
                })
            }
        }
    }

    /**
     * kiểm tra thay đổi va set lại state
     */
    componentDidUpdate (prevProps) {
        let {arrayData} = this.props;
        if (JSON.stringify(arrayData) !== JSON.stringify(prevProps.arrayData)) {
            if(Array.isArray(arrayData)) {
                if (typeof arrayData[0] !== 'object') {
                    let newArray = [];
                    arrayData.map((item, index) => {
                        newArray.push({
                            id: index,
                            value: item
                        })
                    });
                    this.setState({
                        arrayData: fromJS(newArray)
                    })
                } else {
                    this.setState({
                        arrayData: fromJS(arrayData)
                    })
                }
            }
        }
    }

    /**
     * kiểm tra thay đổi của state với props
     * @returns {boolean}
     */
    isDataChange = () => {
        let {arrayData} = this.props;
        if(Array.isArray(arrayData)) {
            if (typeof arrayData[0] !== 'object') {
                let newArray = [];
                arrayData.map((item, index) => {
                    newArray.push({
                        id: index,
                        value: item
                    })
                });

                return JSON.stringify(newArray) !== JSON.stringify(this.state.arrayData)
            } else {
                return JSON.stringify(arrayData) !== JSON.stringify(this.state.arrayData)
            }
        }
    };

    /**
     * thêm 1 row trong meta data
     */
    addRow = () => {
        let arrayData = this.state.arrayData.toJS();
        let lastItem = arrayData[arrayData.length - 1];
        arrayData.push({
            id: lastItem ? lastItem.id+1 : 0,
            value: '',
            isEdit: true
        });

        this.setState({
            arrayData: fromJS(arrayData)
        })
    };

    /**
     * edit
     */
    editToggle = () => {
        this.setState({isEdit: !this.state.isEdit});
    };

    /**
     * xóa row
     * @param index
     */
    removeRow = (index) => {
        let arrayData = this.state.arrayData.toJS();
        arrayData.splice(index, 1);

        this.setState({
            arrayData: fromJS(arrayData)
        })
    };

    /**
     * change value
     * @param e
     * @param keyPath
     */
    onChangeInput = (e, keyPath) => {
        let arrayData = this.state.arrayData;
        arrayData = arrayData.setIn(keyPath, e.target.value);

        this.setState({
            arrayData
        })
    };

    /**
     * kiểm tra trùng key và đưa ra thông báo
     * @param e
     * @param index
     */
    onBlurInput = (e, index) => {
        let arrayData = this.state.arrayData;
        // const result = arrayData.filter(obj => obj.get('key').toLowerCase() === e.target.value.toLowerCase());
        //
        // if(result.toJS().length > 1) {
        //     arrayData = arrayData.setIn([index, 'error'], 'Key đã tồn tại');
        // } else {
        //     arrayData = arrayData.setIn([index, 'error'], '');
        // }

        this.setState({
            arrayData
        })
    };

    onSave = () => {
        let arrayData = this.state.arrayData;
        this.setState({
            isEdit: false
        });
        this.props.onSave(arrayData.toJS(), this.props.field)
    };

    renderRow = (item, index) => {
        return (
            <div className="border-bootom-1x bd-color-gray" key={index}>
                <div className="row">
                    <div className="col-xl-10 col-md-10 col-10">
                        <a className="roboto-regular txt-size-h4 txt-color-blue dpl-block pdt20 pdbt15">
                            {item.value}
                        </a>
                    </div>
                    <div className="col-xl-2 col-md-2 col-2">
                        <a onClick={() => this.removeRow(index)} className="_removeArrayInput txt-size-h3 cursor-pointer txt-color-black3 flr mgt20">
                            <i className="far fa-trash-alt" />
                        </a>
                    </div>
                </div>
            </div>
        )
    };

    renderRowEit = (item, index) => {
        return (
            <div className="mgt10 bd-color-gray" key={index}>
                <div className="row">
                    <div className="col-xl-10 col-md-10 col-10">
                        <span>
                            <input
                                type="text"
                                name="value"
                                placeholder={this.props.placeholder || 'Nhập Value'}
                                onChange={(e) => this.onChangeInput(e, [index, 'value'])}
                                value={item.value || ''}
                            />
                        </span>
                    </div>
                    <div className="col-xl-2 col-md-2 col-2">
                        <a onClick={() => this.removeRow(index)} className="_removeArrayInput txt-size-h3 cursor-pointer txt-color-black3 flr mgt5">
                            <i className="far fa-trash-alt" />
                        </a>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const arrayData = this.state.arrayData.toJS();
        return (
            <div className="tabsdetail__top_uri mgbt30">

                <div className="border-bootom-2x bd-color-gray pdbt15">
                    <div className="row ">
                        <div className="col-xl-12 col-md-12 COL-12">
                            <span className="txt-color-black txt-size-h4 roboto-bold">
                              Link
                            </span>
                            <div className="appinfo__top_btn position-ab">
                                <ul>
                                    {
                                        this.isDataChange()
                                            ?
                                            <li key={'edit'} className="fll">
                                                <a onClick={() => this.onSave()} className="_btnSaveArrayInput cursor-pointer btn btn--green">
                                                    Lưu lại
                                                </a>
                                            </li>
                                            :
                                            [
                                                <li key={'edit'} className="fll mgr10">
                                                    <a onClick={() => this.editToggle()} className="_btnEditArrayInput cursor-pointer btn btn--green">
                                                        Chỉnh sửa
                                                    </a>
                                                </li>,
                                                <li key={'create'} className="fll">
                                                    <a onClick={() => this.addRow()} className="_btnAddRowArrayInput cursor-pointer btn btn--blue">
                                                        Thêm mới
                                                    </a>
                                                </li>
                                            ]
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        {
                            arrayData.length === 0
                                ?
                                <div className="metadata-row text-center mgt20">Không có bản ghi nào.</div>
                                :
                                arrayData.map((item, index) => {
                                    if (!this.state.isEdit && !item.isEdit) {
                                        return this.renderRow(item, index)
                                    }
                                    return this.renderRowEit(item, index)
                                })
                        }
                    </div>
                </div>

            </div>
        );
    }
}