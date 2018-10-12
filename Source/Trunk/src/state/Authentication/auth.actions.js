import axios from 'axios';
import querystring from 'querystring';
import { authType } from './auth.type';
const ROOT_URL = 'http://localhost/EPS.QLTS.Services.WebAPI/'

export function signinUser({ email, password }) {

    return function (dispatch) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        // submit email and password to server
        const request = axios.post(`${ROOT_URL}/oauth/token`,
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
                localStorage.setItem('token', response.data.token)

                // -if request is good, we need to update state to indicate user is authenticated
                dispatch({ type: authType.AUTH_USER })
            })

            // If request is bad...
            // -Show an error to the user
            .catch(() => {
                dispatch(authError('Thông tin đăng nhập không chính xác!'))
            })

    }
}

export function signoutUser() {
    localStorage.removeItem('token')
    return {
        type: authType.UNAUTH_USER
    }
}

export function signupUser({ email, password, passwordConfirmation }) {
    return function (dispatch) {
        axios.post(`${ROOT_URL}/signup`, { email, password, passwordConfirmation })
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

export function fetchMessage() {
    return function (dispatch) {
        axios.get(ROOT_URL, {
            headers: { authorization: localStorage.getItem('token') }
        })
            .then(response => {
                dispatch({
                    type: authType.FETCH_MESSAGE,
                    payload: response.data.message
                })
            })
    }
}