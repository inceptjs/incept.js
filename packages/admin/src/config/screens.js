//vendor imports
import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import thunk from 'redux-thunk'
//local imports
import Screen from '../components/Screen'

const initialState = []
const ADD = Symbol('ADD')
const OPEN = Symbol('OPEN')
const CLOSE = Symbol('CLOSE')
const REMOVE = Symbol('REMOVE')

let key = 0
function reducer(state = initialState, { type, payload }) {
  switch(type) {
    case ADD: 
      return state.concat([ payload ])
    case CLOSE: 
      return state.slice(state.length)
    case OPEN: 
      return state.slice(state.length).concat([ payload ])
    case REMOVE: 
      return state.slice(0, -(payload))
    default: 
      return state
  }
}

class State {
  constructor() {
    this.store = createStore(reducer, applyMiddleware(thunk))
    this.container = null
  }
  
  backward(amount = 1) {
    this.useDispatch().backward(amount)
  }

  close() {
    this.useDispatch().close()
  }

  forward(body) {
    this.useDispatch().forward(body)
  }

  get() {
    return useSelector((state) => state)
  }

  open(body) {
    this.useDispatch().open(body)
  }

  setEffectsContainer(container) {
    this.container = container
    //do the scroll effect
    const screens = Math.max(0, this.store.getState().length - 1)
    container.scrollLeft = screens * container.clientWidth
  }

  useDispatch() {
    return new DispatchState(this, useDispatch())
  }

}

class DispatchState {
  constructor(state, dispatch) {
    this._state = state
    this._dispatch = dispatch
  }

  backward = (amount = 1) => {
    this._dispatch((dispatch) => {
      //get the effects container and the current length
      const container = this._state.container
      const length = this._state.store.getState().length
      //if it's not mounted yet (for some react reason...)
      if (!container || length < 2) {
        //just remove the screens
        return dispatch({ type: REMOVE, payload: amount })
      }
      
      //calculate scroll to
      const screens = Math.max(0, length - (amount + 1))
      const scrollTo = screens * container.clientWidth
      //remove on scroll complete
      const remove = () => {
        if (container.scrollLeft == scrollTo) {
          dispatch({ type: REMOVE, payload: amount })
          container.removeEventListener('scroll', remove, true)
        }
      }
      container.addEventListener('scroll', remove, true)
      container.scrollLeft = scrollTo
    })
  }

  close = () => {
    this._dispatch({ type: CLOSE })
  }

  forward = (body) => {
    this._dispatch({ 
      type: ADD, 
      payload: (
        <Screen key={++key}>
          {body}
        </Screen>
      )
    })
  }

  open = (body) => {
    this._dispatch({ 
      type: OPEN, 
      payload: (
        <Screen key={++key}>
          {body}
        </Screen>
      )
    })
  }
}

const state = new State
export default state