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
    ADD_TO_FAVORITES_REQUEST, REMOVE_FROM_FAVORITES_REQUEST, ADD_TO_UPVOTED_REQUEST, REMOVE_FROM_UPVOTED_REQUEST,
} from './actions';



export function* addToFavorites(data){
  try{
    // const response = yield call(firebaseService.getBadplatser);
      const response = yield call(firebaseService.addToFavoritesService, data.payload)
    
  } catch(e){
  }
}
export function* removeFromFavorites(data){
    try{
        // const response = yield call(firebaseService.getBadplatser);
          const response = yield call(firebaseService.removeFromFavorites, data.payload)
        
      } catch(e){
      }
} 


export function* addToUpvoted(data){
  try{
    data.upvote = true

      const response = yield all([
        call(firebaseService.addToUpvotesService, data.payload),
        call(firebaseService.addToLocationsUpvote, data)
      ])


      
  } catch(e){
  }
}
export function* removeFromUpvoted(data){
    try{
        data.upvote = false
        // const response = yield call(firebaseService.getBadplatser);
          const response = yield all([
            call(firebaseService.removeFromUpvoted, data.payload),
            call(firebaseService.addToLocationsUpvote, data)
          ])

        
      } catch(e){
      }
} 


export function* watchAddToUpv(){
  yield takeLatest(ADD_TO_UPVOTED_REQUEST, addToUpvoted);
}

export function* watchRemoveToUpv(){
  yield takeLatest(REMOVE_FROM_UPVOTED_REQUEST, removeFromUpvoted);
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
    fork(watchRemoveToFav),
    fork(watchAddToUpv),
    fork(watchRemoveToUpv)
  ]);
}
