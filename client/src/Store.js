import { createContext, useContext, useState } from 'react';

const Store = createContext();
export const useStore = () => useContext(Store);

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
  });
  const dispatch = {
    signin: () => {},
    signup: () => {},
  };

  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
