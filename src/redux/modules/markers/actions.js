// @flow

import { createAction } from 'redux-actions';

export const INC = 'INC';
export const DEC = 'DEC';

export const REQUEST_BADPLATSER="REQUEST_BADPLATSER"
export const RECEIVED_BADPLATSER="RECIEVED_BADPLATSER"

export const SET_SELECTED_BADPLATS="SET_SELECTED_BADPLATS"

export const requestBadplatser = () => ({type: REQUEST_BADPLATSER})
export const receivedBadplatser = (data) => ({type: RECEIVED_BADPLATSER, payload: data})

export const setSelectedBadPlats = (i) => ({type:SET_SELECTED_BADPLATS, payload: i })

export const increment = () => ({type:INC})
export const decrement = () => ({type:DEC})

export const markersActionCreators = {
  increment,
  decrement,
  requestBadplatser,
  receivedBadplatser,
  setSelectedBadPlats
};
