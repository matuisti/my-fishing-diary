import { useReducer, createContext } from 'react';

const user = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser") || '') : null;

const initialState = {
  user: user,
  items: [],
  info: [],
  loading: false,
  errorMessage: null,
  modal: {
    type: null,
    active: false,
    modalData: null
  }
};

interface IStoreContextData {
  state?: any;
  dispatch: React.Dispatch<any>;
};

const store = createContext<IStoreContextData>({
  state: initialState,
  dispatch: () => null
});
const { Provider } = store;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        items: action.items
      };
    case "HANDLE_MODAL":
      return {
        ...state,
        modal: {
          ...state.modal,
          ...action.modal
        },

      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.user
      }
    case "LOGIN_ERROR":
      return {
        ...state,
        errorMessage: action.error
      }
    case "LOGOUT":
      return {
        ...state,
        user: null
      }
    default:
      return state;
  }
};

const StateProvider: React.FC = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Provider value={{ state, dispatch }}>
      {props.children}
    </Provider>
  );
};

export { store, StateProvider };