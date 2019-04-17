// @flow

import { createAction } from 'redux-actions';

export const INC = 'INC';
export const DEC = 'DEC';

export const increment = () => ({type:INC})
export const decrement = () => ({type:INC})

export const markersActionCreators = {
  increment,
  decrement
};
