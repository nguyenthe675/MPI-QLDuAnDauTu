import axios from 'axios';
import querystring from 'querystring';
import AppService from '../../services/app.service';
import { userType } from './user.type';
import { ApiClient } from '../../services/api';

let client = new ApiClient('http://localhost/EPS.QLTS.Services.WebAPI/');

export function getAllUser() {
    return function (dispatch) {
        client.post('/API/User/GetAllUsers').then(response => {
            console.log(response.data);
            dispatch(getData(response.data, userType.USER_GET_ALL));

        }).catch((e) => {
            console.log(e);
        })
    }
}


export function getData(users, type) {
    return {
        type: type,
        users: users
    }
}