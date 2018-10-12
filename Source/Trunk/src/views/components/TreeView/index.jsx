import React from 'react'
import _ from 'lodash'

const fake = {
    id: 0,
    code: 'root',
    children: [
        {
            id: 1, parentId: 0, description: 'Cái méo gì đây', code: 'settings', name: 'Settings',
            children: [
                {id: 11, parentId:1, description: 'Cái méo gì đây 1', code: 'settings1', name: 'Settings 1'},
                {
                    id: 12, parentId:1, code: 'settings2', name: 'Settings 2', children: [
                        {
                            id: 211, parentId:12, code: 'settings21', name: 'Settings 2 - 1',
                            children: [
                                {id: 2111, parentId:211, code: 'settings211', name: 'Settings 2 - 1 - 1'},
                            ]
                        },
                        {id: 221, parentId:12, code: 'settings22', name: 'Settings 2 - 2'},
                    ]
                },
            ]
        },
        {
            id: 10, parentId: 0, code: 'apps', name: 'Apps',
            children: [
                {
                    id: 102, parentId: 10, code: 'apps1', name: 'Apps 1', children: [
                        {
                            id: 1001, parentId: 102, code: 'apps21', name: 'Apps 2 - 1',
                            children: [
                                {id: 10001, parentId: 1001, code: 'apps211', name: 'Apps 2 - 1 - 1'},
                            ]
                        },
                    ]
                },
            ]
        }
    ]
};

export default class index extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            arrayData: [],
            originData: [],
        };
    }

    componentDidMount() {
        const {activeData, valueField} = this.props;
        if (Array.isArray(activeData)) {
            let arrayData = [];
            activeData.map(item => {
                arrayData.push(item[valueField])
            });
            this.setState({
                arrayData: arrayData,
                originData: _.cloneDeep(arrayData)
            })
        }

    }

    /**
     * kiểm tra thay đổi va set lại state
     */
    componentDidUpdate (prevProps) {
        let {activeData, valueField} = this.props;
        if (JSON.stringify(activeData) !== JSON.stringify(prevProps.activeData)) {
            if (Array.isArray(activeData)) {
                let arrayData = [];
                activeData.map(item => {
                    arrayData.push(item[valueField])
                });
                this.setState({
                    arrayData: arrayData,
                    originData: _.cloneDeep(arrayData)
                })
            }
        }
    }

    /**
     * hiện nút lưu nếu data có thay đổi
     * @returns {boolean}
     */
    checkSaveBtn = () => {
        let {arrayData, originData} = this.state;
        arrayData.sort();
        originData.sort();

        return JSON.stringify(arrayData) !== JSON.stringify(originData)
    };

    /**
     * toggle show hide
     */
    toggle = (field) => {
        let state = this.state;
        if (!state[field]) {
            state[field] = true;
        } else {
            state[field] = false;
        }

        this.setState({...state})
    };

    /**
     * kiểm tra status của parent theo checked của children
     * @param parent
     * @returns {number}
     */
    checkParentStatus = (parent) => {
        const {arrayData} = this.state;
        //not checked:0, checked:1, semi checked: 2
        let result = 0;
        let resultParents = [];

        // kiểm tra xem trong mảng đã có value chưa
        const filter = arrayData.filter(x => x === parent.code)[0];

        if (filter) {
            result = 1
        } else {
            result = 0
        }

        // với trường hợp có children
        if (parent.children && parent.children.length > 0) {
            parent.children.map(i => {
                resultParents.push(this.checkParentStatus(i))
            });

            // nếu tất cả các children đều là checked thì parent cũng sẽ checked
            if (resultParents.filter(x => x === 1).length === parent.children.length) {
                result = 1;
            } else if (resultParents.indexOf(1) > -1 || resultParents.indexOf(2) > -1) {
                // nếu trong các child có checked hoặc semi checked thì parent sẽ là semi checked
                result = 2
            } else {
                result = 0
            }
        }

        return result
    };

    /**
     * lấy icon theo status
     * @param status
     * @returns {*}
     */
    getCheckElementByStatus = (status) => {
        switch (status) {
            case 1:
                return <i className="fas fa-check-square" />;
            case 2:
                return <i className="far fa-minus-square" />;
            default:
                return <i className="far txt-color-black2 fa-square" />
        }
    };

    /**
     * thêm xóa value trong mảng dữ liệu
     * @param item
     * @param status
     */
    toggleValue = (item, status) => {
        let {arrayData} = this.state;

        //nonChecked: 0, checked: 1, semiChecked: 2
        if (status === 0) {
            //this.props.onSave(item.code);
            arrayData.push(item.code)
        } else {
            //this.props.onDelete(item.code);
            const index = arrayData.indexOf(item.code);
            arrayData.splice(index, 1);
        }

        const grandParent = this._findInTree(item.parentId, fake);
        if (grandParent.result) this.toggleParentByChild(grandParent.result, status);

        // với trường hợp có children
        if (item.children && item.children.length > 0) {
            item.children.map(i => {
                this.toggleValue(i, status)
            })
        }
        this.setState({arrayData: arrayData.sort()})
    };

    /**
     * toggle value của parent theo children
     * @param parent
     * @param status
     */
    toggleParentByChild = (parent, status) => {
        let {arrayData} = this.state;
        let k = 0;
        parent.children.map(item => {
            if(arrayData.indexOf(item.code) > -1) {
                k++;
            }
        });

        // kiểm tra nếu parent có trong mảng arrayData nhưng ko có children nào checked thì sẽ remove khỏi mảng
        if (k === 0 && arrayData.indexOf(parent.code) > -1 && status !== 0) {
            const index = arrayData.indexOf(parent.code);
            arrayData.splice(index, 1);
        } else if (k > 0 && arrayData.indexOf(parent.code) < 0 && status === 0) {
            // kiểm tra nếu parent ko có trong mảng nhưng có child checked thì sẽ add thêm vào mảng
            arrayData.push(parent.code)
        }

        if (parent.parentId) {
            const grandParent = this._findInTree(parent.parentId, fake);
            if (grandParent.result) this.toggleParentByChild(grandParent.result, status)
        }
    };

    /**
     * tìm kiếm item trong tree với id
     * @param id
     * @param tree
     * @returns {*}
     * @private
     */
    _findInTree = (id, tree) => {
        if (tree.id === id) {
            let path = [tree.code];
            return {result: tree, path};
        } else if (tree.children) {
            //THIS IS THE CHANGES THAT I NEED
            for (let children of tree.children) {
                let tmp = this._findInTree(id, children);
                if (!_.isEmpty(tmp)) {
                    tmp.path.unshift(tree.code);
                    return tmp;
                }
            }
            return {};
        }
    };

    /**
     * render childRow với mgl sẽ tăng theo số tầng của tree, ví dụ như 15, 30, 45 ...
     * @param item
     * @param index
     * @param mgl
     * @returns {*}
     */
    renderRowChild = (item, index, mgl) => {
        mgl = mgl + 15;
        return (
            [
                <div className="row mgt25" key={index}>
                    <div className="col-xl-3 col-md-5 col-6">
                        <div className={`mgl${mgl} cursor-pointer`} onClick={() => this.toggleValue(item, this.checkParentStatus(item))}>
                            <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                {
                                    this.getCheckElementByStatus(this.checkParentStatus(item))
                                }
                            </span>
                            <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                {item.name}
                            </span>
                        </div>
                    </div>
                    <div className="col-xl-9 col-md-7 col-6">
                        <span className="roboto-regular txt-size-h3 txt-color-black3 line-height134">
                            {item.description}
                        </span>
                    </div>
                </div>,
                Array.isArray(item.children) && item.children.map((i, j) => this.renderRowChild(i, j, mgl))
            ]
        )
    };

    renderRow = (item, index) => {
        return(
            <div className={`tabsdetail__permission_content--box ${!this.state[`code_${item.code}`] && 'tabsdetail__permission_content--down'} border-bootom-1x bd-color-gray pd15`} key={index}>

                <div className="row">
                    <div className="col-12">

                        <div className="row">
                            <div className="col-xl-3 col-md-5 col-6">
                                <div className={'cursor-pointer'} onClick={() => this.toggleValue(item, this.checkParentStatus(item))}>
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        {
                                            this.getCheckElementByStatus(this.checkParentStatus(item))
                                        }
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-bold">
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-7 col-6">
                                <span className="roboto-regular txt-size-h3 txt-color-black3 line-height134">
                                    {item.description}
                                </span>
                                {
                                    this.state[`code_${item.code}`]
                                    ?
                                    <span onClick={() => this.toggle(`code_${item.code}`)} className="roboto-regular txt-size-h4 txt-color-blue2 flr cursor-pointer">
                                        Thu gọn <i className="fas fa-chevron-up txt-size-h5" />
                                    </span>
                                    :
                                    <span onClick={() => this.toggle(`code_${item.code}`)} className="roboto-regular txt-size-h4 txt-color-blue2 flr cursor-pointer">
                                        Xem thêm  <i className="fas fa-chevron-down txt-size-h5" />
                                    </span>
                                }


                            </div>
                        </div>

                        <div className="wp-row">
                            {
                                Array.isArray(item.children) && item.children.map((i, j) => this.renderRowChild(i, j, 0))
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    };

    onSave = () => {
        const {arrayData, originData} = this.state;
        let arrayAdd = '';
        let arrayDelete = '';

        // tìm ra các item đc thêm vào arrayData
        arrayData.map(item => {
            if (originData.indexOf(item) < 0) {
                arrayAdd = arrayAdd + item + ','
            }
        });

        // tìm ra các item bị xóa khỏi originData
        originData.map(item => {
            if (arrayData.indexOf(item) < 0) {
                arrayDelete = arrayDelete + item + ','
            }
        });

        if (arrayAdd.length > 0 && arrayAdd[arrayAdd.length - 1] === ',') arrayAdd = arrayAdd.slice(0, -1);

        if (arrayDelete.length > 0 && arrayDelete[arrayDelete.length - 1] === ',') arrayDelete = arrayDelete.slice(0, -1);

        this.props.onAdd(arrayAdd);
        this.props.onDelete(arrayDelete)
    };

    render() {
        const {arrayData} = this.state;
        const {data} = this.props;
        return (
            <div className="tabsdetail__permission bd1px bd-color-gray bd-rdu mgbt20">
                <div className="tabsdetail__permission_top pd15">
                    <div className="row ">
                        <div className="col-xl-3 col-md-5 col-6 align-center">
                            <span onClick={() => this.toggleValue(fake, this.checkParentStatus(fake))} className="_selectAll cursor-pointer txt-color-black txt-size-h4 roboto-bold">
                                {
                                    this.getCheckElementByStatus(this.checkParentStatus(fake))
                                } Tên chức năng
                            </span>
                        </div>
                        <div className="col-xl-8 col-md-6 col-5 align-center">
                            <span className="txt-color-black txt-size-h4 roboto-bold">
                                Mô tả
                            </span>
                        </div>
                        <div className="col-xl-1 col-md-1 col-1">
                            {
                                this.checkSaveBtn()
                                &&
                                <a onClick={() => this.onSave()} className="btn btn-small btn--green pull-right">
                                    Lưu
                                </a>
                            }
                        </div>
                    </div>
                </div>
                <div className="tabsdetail__permission_content">
                    {fake.children.map((item, index) => this.renderRow(item, index))}
                </div>
            </div>
        );
    }
}