import React from 'react';
/*export function adduser(objs)
{
    let i;
    let s;
    for(i=0;i<objs.length;i++)
    {
        s=Display(objs[i]);
    }
    return(s)
}*/
export function Display(obj)
{
    return(
        <div className="col-md-12 info-contain">
            <div className="div-avata">
                <img src={obj.integration.logo} alt={"avata"} className="img-avt"/>
            </div>
            <div className="div-info col-md-12">
                <div className="col-md-12 info-text">
                    <span><strong>{obj.fullName} </strong>&nbsp;&nbsp;</span>
                </div>
                <div className="col-md-12 info-text">
                    <div className="col-sm-7 info-nop">
                        <div className="col-sm-4 info-items">
                            <span>Tên tài khoản: </span>
                        </div>
                        <div className="col-sm-8 info-items">
                            <span>{obj.email}</span>
                        </div>
                    </div>
                    <div className="col-sm-5 info-nop">
                        <div className="col-sm-4 info-items">
                            <span>Số dư:</span>
                        </div>
                        <div className="col-sm-8 info-items">
                            <span><strong>15.420.000 VNĐ</strong></span>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 info-text">
                    <div className="col-sm-7 info-nop">
                        <div className="col-sm-4 info-items">
                            <span>Số điện thoại: </span>
                        </div>
                        <div className="col-sm-8 info-items">
                            <span>0981018504</span>
                        </div>
                    </div>
                    <div className="col-sm-5 info-nop">
                        <div className="col-sm-4 info-items">
                            <span>Cấp VIP:</span>
                        </div>
                        <div className="col-sm-8 info-items">
                            <span><strong>4</strong></span>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 info-text">
                    <div className="col-sm-7 info-nop">
                        <div className="col-sm-4 info-items">
                            <span>Dịch vụ: </span>
                        </div>
                        <div className="col-sm-8 info-items">
                            <span><strong>{obj.integration.integrationName}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

