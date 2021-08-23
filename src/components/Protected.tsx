import { useContext, ReactNode, useEffect } from 'react';
import { store, handleModal } from '../context/index';

interface IProtectedProps {
  children: ReactNode;
  notLoggedIn: ReactNode;
};

const Protected = (props: IProtectedProps) => {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    if (!state.user) {
      handleModal(dispatch, { type: 'LOGIN', active: true });
    }
  }, [state.user, dispatch])

  return (
    state.user ? (
      <>
        {props.children}
      </>
    ) : (
      <>
        {props.notLoggedIn}
      </>
    )
  );
};

export default Protected;