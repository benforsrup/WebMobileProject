// @flow

import {
  INC, DEC
} from './actions';

export const DEFAULT = {
  "testing":10
};

export default function markers(state = DEFAULT, action = {}) {
  const { type, payload } = action;
  console.log(action)

  switch (type) {
    case INC: {
      return {
        "testing": state["testing"] + 1
      };
    }
    case DEC: {
      return {
        "testing": state["testing"] -1
      };
    }
    default:
      return state;
  }
}
