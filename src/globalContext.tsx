import { createContext, useContext, useReducer } from "react";

const GlobalContext = createContext({ state: {} });

export const ACTIONS = {
  SET_EMPLOYEE: "SET_EMPLOYEE",
  SET_ORDERS: "SET_ORDERS",
};

const initialState = {
  currentEmployee: null,
  orders: {
    layering: [],
    decorating: [],
    finishing: [],
    fondantFinishing: [],
  },
};

const globalReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_EMPLOYEE:
      return {
        ...state,
        currentEmployee: action.payload,
      };
    case ACTIONS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    default:
      return state;
  }
};

const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
}

export { GlobalContextProvider, useGlobalContext };
