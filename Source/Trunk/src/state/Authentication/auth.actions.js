import querystring from 'querystring';
import AppService from '../../services/app.service';
import { authType } from './auth.type';
import { ApiClient } from '../../services/api';

let client = new ApiClient('http://localhost/EPS.QLTS.Services.WebAPI/');

export function signinUser({ email, password }) {

    return function (dispatch) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        // submit email and password to server
        const request = client.post(`/oauth/token`,
            querystring.stringify({
                username: email,
                password,
                grant_type: 'password',
                client_id: 'koFeApp',
                donvi: 'dc9f8c36-b326-0c44-b126-410ea4275fa1'
            }),
            config
        );
        request
            .then(response => {
                // -Save the JWT token
                AppService.setAccessToken(response.data);
                // -if request is good, we need to update state to indicate user is authenticated
                dispatch({ type: authType.AUTH_USER })
                dispatch(loginSuccess(response.data.avatar));
            })

            // If request is bad...
            // -Show an error to the user
            .catch((e) => {
                console.log(e);
                dispatch(authError('Thông tin đăng nhập không chính xác!'))
            })

    }
}

export function signoutUser() {
    return function (dispatch) {
        client.post('/API/User/Logout').then(response => {
            AppService.setAccessToken(null);
            dispatch({ type: authType.UNAUTH_USER });

        }).catch((e) => {
            console.log(e);
            dispatch(authError('Có lỗi xảy ra khi đăng xuất!'))
        })
    }
}

export function signupUser({ email, password, passwordConfirmation }) {
    return function (dispatch) {
        client.post(`/signup`, { email, password, passwordConfirmation })
            .then(response => {
                dispatch({ type: authType.AUTH_USER })
                localStorage.setItem('token', response.data.token)
            })
            .catch(({ response }) => {
                dispatch(authError(response.data.error))
            })
    }
}

export function authError(error) {
    return {
        type: authType.AUTH_ERROR,
        payload: error
    }
}

export function loginSuccess(avatar) {
    return {
        type: authType.AUTH_USER,
        avatar: avatar
    }
}
// export function fetchMessage() {
//     return function (dispatch) {
//         axios.get(ROOT_URL, {
//             headers: { authorization: localStorage.getItem('token') }
//         })
//             .then(response => {
//                 dispatch({
//                     type: authType.FETCH_MESSAGE,
//                     payload: response.data.message
//                 })
//             })
//     }
// }