// @flow

import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {
  data,
  markers
} from '../modules';

const config = {
  key: 'LIFTED_REDUX_STORE',
  storage
};

const appReducer = persistCombineReducers(config, {
  data,
  markers
});

export default function rootReducer(state, action) {
  return appReducer(state, action);
}
