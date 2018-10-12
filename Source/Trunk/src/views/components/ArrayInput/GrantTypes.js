import React, {Component} from 'react'

const list = [
    {id: 'implicit', name: 'Implicit'},
    {id: 'authorization_code', name: 'Authorization Code'},
    {id: 'refresh_token', name: 'Refresh Token'},
    {id: 'client_credentials', name: 'Client Credentials'},
    {id: 'password', name: 'Password'},
    {id: 'mfa', name: 'MFA'}
];

export default class GrantTypes extends Component {
    onSave = (value) => {
        let orginData = this.props.orginData || [];
        // kiểm tra nếu value tồn tại thì xóa khỏi array, nếu chưa có thì thêm vào
        const index = orginData.indexOf(value);
        if (index > -1) {
            orginData.splice(index, 1)
        } else {
            orginData.push(value)
        }
        console.log('orginData', orginData);
        this.props.onSave(orginData)
    };

    render() {
        const orginData = this.props.orginData || [];
        return (
            <div className="tabsdetail__top_grant mgbt30">
                <ul>

                    {
                        list.map((item, index) => {
                            if (orginData.indexOf(item.id) > -1) {
                                return (
                                    <li className="fll mgr15 mgbt15" key={index}>
                                        <a onClick={() => this.onSave(item.id)} className={`_${'grantTypes'+item.id} cursor-pointer tabsdetail__top_grant--check txt-size-h3 roboto-regular txt-color-black2`}>
                                            <span className="dpl-il-block mgr5">
                                              <i className="far fa-check-square" />
                                            </span> {item.name}
                                        </a>
                                    </li>
                                )
                            }
                            return (
                                <li className="fll mgr15 mgbt15" key={index}>
                                    <a onClick={() => this.onSave(item.id)} className={`_${'grantTypes'+item.id} cursor-pointer tabsdetail__top_grant--uncheck txt-size-h3 roboto-regular txt-color-black2`}>
                                        <span className="dpl-il-block mgr5">
                                          <i className="far fa-square" />
                                        </span> {item.name}
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
