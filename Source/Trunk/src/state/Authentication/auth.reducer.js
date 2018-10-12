import { authType } from './auth.type';

export default function authReducer(state = {}, action) {
    switch (action.type) {
        case authType.AUTH_USER:
            return { ...state, error: '', authenticated: true }
        case authType.UNAUTH_USER:
            return { ...state, authenticated: false }
        case authType.AUTH_ERROR:
            return { ...state, error: action.payload }
        case authType.FETCH_MESSAGE:
            return { ...state, message: action.payload }
        default:
            return state
    }
}
