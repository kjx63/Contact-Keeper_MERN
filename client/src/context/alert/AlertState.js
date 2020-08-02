import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

// Create initial state
const AlertState = (props) => {
  const initialState = [];

  // Pull out the state and dispatch to the reducer
  // // state allows us to access anything in our state
  // // dispatch allows us to dispatch objects to the redicer
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Actions
  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id },
    });

    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
    }, timeout);
  };

  // Return our providers so that we can wrap our entire application with this context
  return (
    <AlertContext.Provider
      //anything we want to be able to access from other components
      // including state and actions need to go in here
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
