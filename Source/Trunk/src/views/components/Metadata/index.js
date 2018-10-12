import React from 'react'
import _ from 'lodash'
import {fromJS} from 'immutable'
export default class index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            metaDatas: fromJS([
                {
                    id: 0,
                    key: '',
                    value: '',
                    isEdit: true
                }
            ])
        }
    }

    componentDidMount () {
        if(this.props.metadata) {
            let metadata = [];
            // chuyển obj metadata sang array
            if (!Array.isArray(this.props.metadata)) {
                metadata = this.convertObjToArray(_.cloneDeep(this.props.metadata));
            } else {
                metadata = this.props.metadata
            }

            this.setState({
                metaDatas: fromJS(metadata)
            })
        }
    }

    /**
     * kiểm tra thay đổi va set lại state
     */
    componentDidUpdate (prevProps) {
        if (JSON.stringify(this.props.metadata) !== JSON.stringify(prevProps.metadata)) {
            let metadata = [];
            // chuyển obj metadata sang array
            if (!Array.isArray(this.props.metadata)) {
                metadata = this.convertObjToArray(_.cloneDeep(this.props.metadata));
            } else {
                metadata = this.props.metadata
            }

            this.setState({
                metaDatas: fromJS(metadata)
            })
        }
    }

    /**
     * chuyển metadata obj sang array
     * @param obj
     */
    convertObjToArray = (obj) => {
        let array = [];
        for (let prop in obj) {
            array.push({
                key: prop,
                value: obj[prop]
            })
        }

        return array;
    };

    /**
     * kiểm tra thay đổi của state với props
     * @returns {boolean}
     */
    isDataChange = () => {
        let metadata = [];
        // chuyển obj metadata sang array
        if (!Array.isArray(this.props.metadata)) {
            metadata = this.convertObjToArray(_.cloneDeep(this.props.metadata));
        } else {
            metadata = this.props.metadata
        }
        return JSON.stringify(metadata) !== JSON.stringify(this.state.metaDatas);
    };

    /**
     * thêm 1 row trong meta data
     */
    addRow = () => {
        let metaDatas = this.state.metaDatas.toJS();
        let lastItem = metaDatas[metaDatas.length - 1];
        metaDatas.push({
            id: lastItem ? lastItem.id+1 : 0,
            key: '',
            value: '',
            isEdit: true
        });

        this.setState({
            metaDatas: fromJS(metaDatas)
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
        let metaDatas = this.state.metaDatas.toJS();
        metaDatas.splice(index, 1);

        this.setState({
            metaDatas: fromJS(metaDatas)
        })
    };

    /**
     * change value
     * @param e
     * @param keyPath
     */
    onChangeInput = (e, keyPath) => {
        let metaDatas = this.state.metaDatas;
        metaDatas = metaDatas.setIn(keyPath, e.target.value);

        this.setState({
            metaDatas
        })
    };

    /**
     * kiểm tra trùng key và đưa ra thông báo
     * @param e
     * @param index
     */
    onBlurInput = (e, index) => {
        let metaDatas = this.state.metaDatas;

        if (!e.target.value) {
            metaDatas = metaDatas.setIn([index, 'error'], 'Key không thể để trống');
        } else {
            const result = metaDatas.filter(obj => obj.get('key').toLowerCase() === e.target.value.toLowerCase());

            if(result.toJS().length > 1) {
                metaDatas = metaDatas.setIn([index, 'error'], 'Key đã tồn tại');
            } else {
                metaDatas = metaDatas.setIn([index, 'error'], '');
            }
        }
        this.setState({
            metaDatas
        })
    };

    onSave = () => {
        let metaDatas = this.state.metaDatas.toJS();

        metaDatas.map(item => {
            if (!item.key) {
                return item.error = 'Key không thể để trống'
            }
        });

        this.setState({
            isEdit: false,
            metaDatas: fromJS(metaDatas)
        }, () => {
            this.props.onSave(metaDatas)
        });
    };

    renderRow = (item, index) => {
        return (
            <div className="border-bootom-1x bd-color-gray" key={index}>
                <div className="row">
                    <div className="col-xl-3 col-md-3 col-4">
                        <span className="roboto-regular txt-size-h4 txt-color-black2 dpl-block pdt20 pdbt15">
                            {item.key}
                        </span>
                    </div>
                    <div className="col-xl-7 col-md-7 col-7">
                        <p className="roboto-regular txt-size-h4 txt-color-black2 line-height167 pdt20 pdbt15">
                            {item.value}
                        </p>
                    </div>
                    <div className="col-xl-2 col-md-2 col-1">
                        <a onClick={() => this.removeRow(index)} className="_removeMetadata cursor-pointer txt-size-h3 txt-color-black3 flr mgt20">
                            <i className="far fa-trash-alt" />
                        </a>
                    </div>
                </div>
            </div>
        )
    };

    renderRowEit = (item, index) => {
        return (
            <div className="border-bootom-1x bd-color-gray" key={index}>
                <div className="row">
                    <div className="col-xl-3 col-md-3 col-4">
                        <span className="pdt20 pdbt15 dpl-block">
                            <input
                              name="key"
                              type="text"
                              placeholder="Nhập Key"
                              onChange={(e) => {
                                  if (/^@?[a-zA-Z_]\w*(\.@?[a-zA-Z_]\w*)*$/i.test(e.target.value)) {
                                      this.onChangeInput(e, [index, 'key'])
                                  }
                              }}
                              onBlur={(e) => this.onBlurInput(e, index)}
                              value={item.key || ''}
                            />
                            {
                                item.error && <div className="txt-size-h5 color-red mgt10">{item.error}</div>
                            }
                        </span>
                    </div>
                    <div className="col-xl-7 col-md-7 col-7">
                        <span className="pdt20 pdbt15 dpl-block">
                          <input
                              name="value"
                              type="text"
                              placeholder="Nhập Value"
                              onChange={(e) => this.onChangeInput(e, [index, 'value'])}
                              value={item.value || ''}
                          />
                        </span>
                    </div>
                    <div className="col-xl-2 col-md-2 col-1">
                        <a onClick={() => this.removeRow(index)} className="_removeMetadata txt-size-h3 cursor-pointer txt-color-black3 flr mgt20">
                            <i className="far fa-trash-alt" />
                        </a>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const metaDatas = this.state.metaDatas.toJS();
        return (
            <div className="tabsdetail__top_metadata mgbt30">
                <div className="border-bootom-2x bd-color-gray pdbt15">
                    <div className="row ">
                        <div className="col-xl-3 col-md-3 col-3">
                            <span className="txt-color-black txt-size-h4 roboto-bold">
                              Key
                            </span>
                        </div>
                        <div className="col-xl-9 col-md-9 col-9">
                            <span className="txt-color-black txt-size-h4 roboto-bold">
                              Value
                            </span>
                            <div className="appinfo__top_btn position-ab">
                                <ul>

                                    {
                                        this.isDataChange()
                                            ?
                                            <li key={'edit'} className="fll">
                                                <a onClick={() => this.onSave()} className="_btnSaveMetadata cursor-pointer btn btn--green">
                                                    Lưu lại
                                                </a>
                                            </li>
                                            :
                                            [
                                                <li key={'edit'} className="fll mgr10">
                                                    <a onClick={() => this.editToggle()} className="_btnEditMetadata cursor-pointer btn btn--green">
                                                        Chỉnh sửa
                                                    </a>
                                                </li>,
                                                <li key={'create'} className="fll">
                                                    <a onClick={() => this.addRow()} className="_btnAddRowMetadata cursor-pointer btn btn--blue">
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
                            metaDatas.length === 0
                                ?
                                <div className="metadata-row text-center mgt20">Không có bản ghi nào.</div>
                                :
                                metaDatas.map((item, index) => {
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