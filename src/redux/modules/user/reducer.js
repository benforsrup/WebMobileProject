// @flow

import {
    ADD_TO_FAVORITES_SUCCESS, UPDATE_USER_DATA, ADD_TO_UPVOTED_SUCCESS,
  } from './actions';
  
  export const DEFAULT = {
   favorites:[],
   upvoted:[]
  };
  
  export default function user(state = DEFAULT, action = {}) {
    const { type, payload } = action;
    switch (type) {
      case ADD_TO_FAVORITES_SUCCESS:
        return {
            ...state,
            favorites:[...state.favorites, payload]
        }
      case ADD_TO_UPVOTED_SUCCESS:
        return {
            ...state,
            upvoted:[...state.upvoted, payload]
        }
      case UPDATE_USER_DATA:
        return payload
      default:
        return state;
    }
  }
  