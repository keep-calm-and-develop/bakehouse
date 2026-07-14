import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type FC,
  type ReactNode,
} from "react";

export interface Employee {
  id: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface Orders {
  layering: unknown[];
  decorating: unknown[];
  finishing: unknown[];
  fondantFinishing: unknown[];
}

export interface GlobalState {
  currentEmployee: Employee | null;
  orders: Orders;
}

export const ACTIONS = {
  SET_EMPLOYEE: "SET_EMPLOYEE",
  SET_ORDERS: "SET_ORDERS",
} as const;

const initialState: GlobalState = {
  currentEmployee: null,
  orders: {
    layering: [],
    decorating: [],
    finishing: [],
    fondantFinishing: [],
  },
};

type GlobalAction =
  | { type: typeof ACTIONS.SET_EMPLOYEE; payload: Employee | null }
  | { type: typeof ACTIONS.SET_ORDERS; payload: Orders };

interface GlobalContextValue {
  state: GlobalState;
  dispatch: Dispatch<GlobalAction>;
}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

const globalReducer = (
  state: GlobalState,
  action: GlobalAction,
): GlobalState => {
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

const GlobalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

function useGlobalContext(): GlobalContextValue {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
}

export { GlobalContextProvider, useGlobalContext };
