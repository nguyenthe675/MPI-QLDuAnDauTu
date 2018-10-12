import React from 'react'
import MainLayout from "../../components/Layout/MainLayout";
import Ribon from '../../components/Ribon'

class Dashboard extends React.Component {
    render() {
        return (
            <MainLayout {...this.props}>
                <Ribon breadCrumb={[]} />

                <div className="container-fluid mgbt30">
                    <div className="row">
                        <div className="col-xl-3 col-md-6 col-12">
                            <h2 className="listapp__title roboto-bold txt-color-black2 txt-size-h2">
                                DASHBOARD
                            </h2>
                        </div>
                    </div>
                </div>
                <p className={'text-center mgt20'}>Hello world!!!</p>
            </MainLayout>
        );
    }
}


export default Dashboard;