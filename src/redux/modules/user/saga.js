// @flow
import {  firebaseService } from 'src/services'

import {
  take,
  put,
  call,
  fork,
  all,takeLatest
} from 'redux-saga/effects';
import firebase from 'react-native-firebase'
import {
    ADD_TO_FAVORITES_REQUEST, REMOVE_FROM_FAVORITES_REQUEST,
} from './actions';



export function* addToFavorites(data){
  // console.log("GET_BADPLATSER")
  try{
    // const response = yield call(firebaseService.getBadplatser);
      console.log("called")
      const response = yield call(firebaseService.addToFavoritesService, data.payload)
    
  } catch(e){
    // console.log(e)
  }
}
export function* removeFromFavorites(data){
    try{
        // const response = yield call(firebaseService.getBadplatser);
          console.log("called")
          const response = yield call(firebaseService.removeFromFavorites, data.payload)
        
      } catch(e){
        // console.log(e)
      }
} 

export function* watchAddToFav(){
  yield takeLatest(ADD_TO_FAVORITES_REQUEST, addToFavorites);
}


export function* watchRemoveToFav(){
    yield takeLatest(REMOVE_FROM_FAVORITES_REQUEST, removeFromFavorites);
  }
  


export default function* () {
  yield all([
    fork(watchAddToFav),
    fork(watchRemoveToFav)
  ]);
}
