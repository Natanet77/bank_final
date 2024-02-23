import { createContext, useContext, Dispatch } from "react";

export type AuthState = {
  isLogged: boolean;
  token: string | null;
  email: string | null;
};

type AuthAction =
  | {
      type: "LOGIN";
      payload: {
        isLogged: boolean;
        token: string;
        email: string;
      };
    }
  | { type: "LOGOUT" };

export const initialAuthState: AuthState = {
  isLogged: false,
  token: null,
  email: null,
};

console.log("AuthContest.initialAuthState: ", initialAuthState);

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      const newState = {
        ...state,
        isLogged: action.payload.isLogged,

        token: action.payload.token,
        email: action.payload.email,
      };
      localStorage.setItem("authState", JSON.stringify(newState));
      return newState;

    case "LOGOUT":
      localStorage.removeItem("authState");
      return initialAuthState;
    default:
      return state;
  }
};

console.log("AuthContest.authReducer", authReducer);
// =========================================
// Створюємо контекст аутентифікації
export const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: Dispatch<AuthAction>;
    }
  | undefined
>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
