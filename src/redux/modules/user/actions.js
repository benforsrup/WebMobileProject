// @flow

import { createAction } from 'redux-actions';


export const ADD_TO_FAVORITES_REQUEST="ADD_TO_FAVORITES_REQUEST"
export const ADD_TO_FAVORITES_SUCCESS="ADD_TO_FAVORITES_SUCCESS"

export const REMOVE_FROM_FAVORITES_REQUEST="REMOVE_FROM_FAVORITES_REQUEST"
export const REMOVE_FROM_FAVORITES_SUCCESS="REMOVE_FROM_FAVORITES_SUCCESS"

export const UPDATE_USER_DATA = "UPDATE_USER_DATA"

export const addToFavorites = (id) => ({type: ADD_TO_FAVORITES_REQUEST, payload: id})
export const addToFavoritesSuccess = (id) => ({type: ADD_TO_FAVORITES_SUCCESS, payload: id})

export const updateUserData = (data) => ({type:UPDATE_USER_DATA, payload: data})

export const removeFromFavorites = (id) => ({type:REMOVE_FROM_FAVORITES_REQUEST, payload:id })


export const userActions = {
    addToFavorites,
    addToFavoritesSuccess,
    updateUserData,
    removeFromFavorites
};
