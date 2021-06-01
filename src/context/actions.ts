
import api from '../api/api';

const getStores = async (dispatch: any) => {
  try {
    // const res = await api.getStores();
    // dispatch({type: 'SET_STORES', stores: res.data});
  } catch (error) {
    dispatch({type: 'SET_INFO', info: { message: error.response.data, level: 'ERROR', active: true }});
  }
};

const login = async (dispatch: any, userCredentials: any) => {
  try {
    const response = await api.login(userCredentials);
    // if (response.user) {
    //   const { user } = response;
    //   const data = { uid: user.uid, email: user.email };
    //   dispatch({ type: 'LOGIN_SUCCESS', userData: data });
    //   localStorage.setItem('currentUser', JSON.stringify(data));
    // } else {
    //   dispatch({ type: 'LOGIN_ERROR', error: response.errors[0] });
    //   return;
    // }
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
};

const logout = async (dispatch: any) => {
  try {
    await api.logout();
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };
};


type modalTypes = {
  type: 'LOGIN' | null
  active: boolean
};

const handleModal = (dispatch: React.Dispatch<any>, modal: modalTypes) => {
  dispatch({ type: 'HANDLE_MODAL',  modal })
};

export {
  getStores, 
  login,
  logout,
  handleModal
};