import React from 'react'
import _ from 'lodash'
export default class Scope extends React.Component {
    render() {
        return (
            <div className="tabsdetail__top_scopes mgbt30">
                <div className="border-bootom-2x bd-color-gray pdbt15 mgbt30">
                    <span className="txt-color-black txt-size-h4 roboto-bold">
                        Select Scopes
                    </span>
                </div>
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-3">
                                <div>
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        <i className="fas fa-check-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-bold">
                                        Repo
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-9">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                    Full control of private repositories
                              </span>
                            </div>
                        </div>
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div className="mgl35">
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        <i className="fas fa-check-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                        repo:status
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                    Access commit status
                              </span>
                            </div>
                        </div>
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div className="mgl35">
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        <i className="fas fa-check-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                        repo_deployment
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                    Access deployment status
                              </span>
                            </div>
                        </div>
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div className="mgl35">
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        <i className="fas fa-check-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                        public_repo
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                    Access public repositories
                              </span>
                            </div>
                        </div>
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div className="mgl35">
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        <i className="fas fa-check-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                        repo:invite
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                  Access repository
                              </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-12">
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div>
                                    <span className="txt-color-black2 txt-size-h4 dpl-il-block mgr5">
                                        <i className="far fa-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-bold">
                                        admin:org
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                    Full control of orgs and teams
                              </span>
                            </div>
                        </div>
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div className="mgl35">
                                    <span className="txt-color-green txt-size-h4 dpl-il-block mgr5">
                                        <i className="fas fa-check-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                        write:org
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                  Read and write org and team membership
                              </span>
                            </div>
                        </div>
                        <div className="row mgbt30">
                            <div className="col-xl-3 col-md-3 col-6">
                                <div className="mgl35">
                                    <span className="txt-color-black2 txt-size-h4 dpl-il-block mgr5">
                                        <i className="far fa-square" />
                                    </span>
                                    <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                        read:org
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 col-6">
                              <span className="roboto-regular txt-size-h3 txt-color-black3">
                                  Read org and team membership
                              </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}