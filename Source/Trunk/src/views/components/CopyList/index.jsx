import React from 'react'

export default class index extends React.Component {
    render() {
        return (
            <div className="tabsdetail__top_endpoints mgbt30 ">
                <div className="row">
                    <div className="col-xl-6 col-md-6 col-12">
                        <ul className="mgbt15">
                            <li className="fll pdt10">
                                <label className="roboto-regular txt-size-h4 txt-color-black3 dpl-il-block">
                                    Authorization URL:
                                </label>
                            </li>
                            <li className="fll">
                                <span className="wp-ip dpl-block fll mgr5">
                                    <input type="text" name="" value="https://tranbach.auth0.com/authorize" disabled />
                                </span>
                                <span className="tabsdetail__top_endpoints--copy fll dpl-block txt-size-h3 txt-color-black2 bd-rdu4 cursor-pointer">
                                    <i className="far fa-copy" />
                                </span>
                            </li>
                        </ul>
                        <ul className="mgbt15">
                            <li className="fll pdt10">
                                <label className="roboto-regular txt-size-h4 txt-color-black3 dpl-il-block">
                                    Token URL:
                                </label>
                            </li>
                            <li className="fll">
                                <span className="wp-ip dpl-block fll mgr5">
                                    <input type="text" name="" value="https://tranbach.auth0.com/oauth/token" disabled />
                                </span>
                                <span className="tabsdetail__top_endpoints--copy fll dpl-block txt-size-h3 txt-color-black2 bd-rdu4 cursor-pointer">
                                    <i className="far fa-copy" />
                                </span>
                            </li>
                        </ul>
                        <ul className="mgbt15">
                            <li className="fll pdt10">
                                <label className="roboto-regular txt-size-h4 txt-color-black3 dpl-il-block">
                                    User Info URL:
                                </label>
                            </li>
                            <li className="fll">
                                <span className="wp-ip dpl-block fll mgr5">
                                    <input type="text" name="" value="https://tranbach.auth0.com/userinfo" disabled />
                                </span>
                                <span className="tabsdetail__top_endpoints--copy fll dpl-block txt-size-h3 txt-color-black2 bd-rdu4 cursor-pointer">
                                    <i className="far fa-copy" />
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="col-xl-6 col-md-6 col-12">
                        <ul className="mgbt15">
                            <li className="fll pdt10">
                                <label className="roboto-regular txt-size-h4 txt-color-black3 dpl-il-block">
                                    OpenID Configuration:
                                </label>
                            </li>
                            <li className="fll">
                                <span className="wp-ip dpl-block fll mgr5">
                                    <input type="text" name="" value="https://tranbach.auth0.com/.well-known/openid..." disabled />
                                </span>
                                <span className="tabsdetail__top_endpoints--copy fll dpl-block txt-size-h3 txt-color-black2 bd-rdu4 cursor-pointer">
                                    <i className="far fa-copy" />
                                </span>
                            </li>
                        </ul>
                        <ul className="mgbt15">
                            <li className="fll pdt10">
                                <label className="roboto-regular txt-size-h4 txt-color-black3 dpl-il-block">
                                    JSON Web Key Set:
                                </label>
                            </li>
                            <li className="fll">
                                <span className="wp-ip dpl-block fll mgr5">
                                    <input type="text" name="" value="https://tranbach.auth0.com/.well-known/jwks.js..." disabled />
                                </span>
                                <span className="tabsdetail__top_endpoints--copy fll dpl-block txt-size-h3 txt-color-black2 bd-rdu4 cursor-pointer">
                                    <i className="far fa-copy" />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}