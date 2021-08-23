
import { toast } from 'react-toastify';

import {
    createItemApi, createUserApi, deleteItemApi, getItemsApi, Ilogin, loginApi, logoutApi,
    updateItemApi
} from '../api/api';
import { getCurrentUser } from '../helpers/helper';

export type ModalTypes = 'LOGIN' | 'NEW_DIARY_POST' | 'VIEW_DIARY_POST' | null;

interface IModalTypes {
  type: ModalTypes;
  active: boolean;
  modalData?: any;
};

const getItems = async (dispatch: any) => {
  try {
    const user = getCurrentUser();
    const response = await getItemsApi(user.token, user.userId);
    dispatch({type: 'SET_ITEMS', items: response});
  } catch (error) {
    toast.error('Jokin meni vikaan.. 😢');
  }
};
 
const createItem = async (dispatch: React.Dispatch<any>, item: any) => {
  try {
    const user = getCurrentUser();
    const date = Date.now();
    return await createItemApi(user.token, { ...item, userId: user.userId, createdAt: date });
  } catch (error) {
    throw error;
  }
}

const updateItem = async (item: any) => {
  try {
    const user = getCurrentUser();
    return await updateItemApi(user.token, item);
  } catch (error) {
    
  }
}

const deleteItem = async (itemId: string) => {
  try {
    await deleteItemApi(itemId);
  } catch (error) {
    throw error;
  }
}

const register = async (dispatch: React.Dispatch<any>, credentials: Ilogin) => {
  try {
    return await createUserApi(credentials);
  } catch (error) {
    throw error;
  }
};

const login = async (dispatch: React.Dispatch<any>, credentials: Ilogin) => {
  try {
    const response = await loginApi(credentials);
    if (response.token) {
      const { username, token, userId } = response;
      const data = { userId: userId, token: token, username: username };
      dispatch({ type: 'LOGIN_SUCCESS', user: data });
      localStorage.setItem('currentUser', JSON.stringify(data));
    } else {
      console.log("JEEE")
      dispatch({ type: 'LOGIN_ERROR', error: response.errors[0] });
      return;
    }
  } catch (error) {
    throw error;
  }
};

const logout = async (dispatch: any, token: string) => {
  try {
    await logoutApi(token);
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };
};

const handleModal = (dispatch: React.Dispatch<any>, modal: IModalTypes) => {
  dispatch({ type: 'HANDLE_MODAL',  modal })
};

export {
  getItems,
  register,
  login,
  logout,
  handleModal,
  createItem,
  deleteItem,
  updateItem
};