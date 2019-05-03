// @flow

import { fork, all } from 'redux-saga/effects';
import {
  dataSaga,
  markerSaga,
  userSaga
} from '../modules';

export default function* rootSaga() {
  yield all([
    fork(dataSaga),
    fork(markerSaga),
    fork(userSaga)
  ]);
}
