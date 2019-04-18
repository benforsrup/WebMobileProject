// @flow

import {
  INC, DEC, RECEIVED_BADPLATSER, SET_SELECTED_BADPLATS
} from './actions';

export const DEFAULT = {
  "testing":10,
  markers:[],
  selectedIndex: 0
};

export default function markers(state = DEFAULT, action = {}) {
  const { type, payload } = action;
  console.log(action, payload)

  switch (type) {
    case INC: {
      return {
        ...state,
        "testing": state["testing"] + 1
      };
    }
    case DEC: {
      return {
        ...state,
        "testing": state["testing"] - 1
      };
    }
    case RECEIVED_BADPLATSER:{
      return {
        ...state,
        markers: payload
      }
    }
    case SET_SELECTED_BADPLATS:{
      return {
        ...state,
        selectedIndex: payload
      }
    }
    default:
      return state;
  }
}
