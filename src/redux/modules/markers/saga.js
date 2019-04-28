// @flow

import {  firebaseService } from 'src/services'
import {
  take,
  put,
  call,
  fork,
  all,takeLatest
} from 'redux-saga/effects';

import {
  REQUEST_BADPLATSER,
  fetchDataActionCreators
} from './actions';

export function* asyncGetFacebookUserData({ payload }) {

  const { facebookToken } = payload;

  // eslint-disable-next-line
  const url = `https://graph.facebook.com/v2.11/me?access_token=${facebookToken}&fields=id,name,email,picture{url}`;

  try {
    const response = yield call(App_Service, { url, method: 'GET' });

    if (response.result === 'ok') {
      yield put(fetchDataActionCreators.getFacebookUserDataSuccess(response.data));
    }
  } catch (e) {
    // console.log(e);
  }
}

export function* GetBadplatser(){
  // console.log("GET_BADPLATSER")
  try{
    const response = yield call(firebaseService.getBadplatser);
    if(response.result === 'ok'){
      // console.log(response)
    }
  } catch(e){
    // console.log(e)
  }
}

export function* watchGetBadplatser(){
  yield takeLatest(REQUEST_BADPLATSER, GetBadplatser);
}

export function* watchGetFacebookUserData() {
  while (true) {
    const action = yield take(GET_FACEBOOK_DATA);
    yield* asyncGetFacebookUserData(action);
  }
}

export default function* () {
  yield all([
    fork(watchGetBadplatser),
  ]);
}
