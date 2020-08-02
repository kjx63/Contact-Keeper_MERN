import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';
import Register from '../../components/auth/Register';

// Create initial state
const AuthState = (props) => {
  const initialState = {
    // token is going to be stored in the local storage
    // getItem() is just a vanilla JS method
    token: localStorage.getItem('token'),
    // isAuthenticated tells us whether we are logged in or not
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  // Pull out the state and dispatch to the reducer
  // // state allows us to access anything in our state
  // // dispatch allows us to dispatch objects to the redicer
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Actions
  // Load User - checking whether a user is logged in
  const loadUser = () => console.log('loaduser');

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg,
      });
    }
  };
  // Login User
  const login = () => console.log('login');
  // Logout

  const logout = () => console.log('logout');
  // Clear Errors

  const clearErrors = () =>
    dispatch({
      type: CLEAR_ERRORS,
    });

  // Return our providers so that we can wrap our entire application with this context
  return (
    <AuthContext.Provider
      //anything we want to be able to access from other components
      // including state and actions need to go in here
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
