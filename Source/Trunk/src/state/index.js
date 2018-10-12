import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar'
import { reducer as form } from 'redux-form';
import authReducer from './Authentication/auth.reducer';

const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  form,
  auth: authReducer,
});

export default rootReducer;