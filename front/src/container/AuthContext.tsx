// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useCallback,
//   useContext,
// } from "react";

// interface User {
//   id: string;
//   email: string;
// }

// interface AuthContextType {
//   token: string;
//   login: (token: string, user: User) => void;
//   logout: () => void;
//   updateEmail: (newEmail: string) => Promise<void>;
//   updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   setUser: () => {},
//   token: "",
//   login: () => {},
//   logout: () => {},
//   updateEmail: async () => {},
//   updatePassword: async () => {},
// });

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [token, setToken] = useState<string>("");
//   const [user, setUser] = useState<User | null>(null);

//   const login = useCallback((token: string, newUser: User) => {
//     setToken(token);
//     setUser(newUser);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(newUser));
//   }, []);

//   const logout = useCallback(() => {
//     setToken("");
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }, []);

//   const updateEmail = async (newEmail: string) => {
//     console.log("Updating email with token:", token);
//     try {
//       const response = await fetch("/change-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ email: newEmail }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         console.error("Email update failed:", data.message);
//         throw new Error(data.message || "Email update failed");
//       }

//       setUser((prev) => {
//         if (prev) {
//           return { ...prev, email: newEmail };
//         }
//         return null;
//       });
//     } catch (error) {
//       console.error("Failed to update email:", error);
//     }
//   };

//   const updatePassword = async (oldPassword: string, newPassword: string) => {
//     console.log("Updating password with token:", token);
//     try {
//       const response = await fetch("/change-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ oldPassword, newPassword }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         console.error("Password update failed:", data.message);
//         throw new Error(data.message || "Password update failed");
//       }

//       // Не зберігайте новий пароль в локальному стані або localStorage
//     } catch (error) {
//       console.error("Failed to update password:", error);
//     }
//   };

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     console.log(storedToken);
//     const storedUser = localStorage.getItem("user");
//     console.log(storedUser);
//     console.log("Loaded token:", token);
//     console.log("Loaded user:", storedUser);
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         login,
//         logout,
//         updateEmail,
//         updatePassword,
//         user,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// export default AuthContext;

import { createContext, useContext, Dispatch } from "react";

// Створюємо контекст, в якому будемо тримати дані аутентифікації
// В контексті буде знаходитись:
//    створений state через useReducer, який буде знаходитись
//            властивість token та об'єкт user
//    dispatch функція, яка буде мати наступні типи дій:
//            увійти в акаунт, вийти з акаунту

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

// ==============   Keepin login in For testsing private pages
// export const initialAuthState: AuthState = {
//   isLogged: true,
//   isConfirmed: true,
//   token: "Q&FdPDvByVne",
//   email: "bob@mail.com",
// };

console.log("AuthContest.initialAuthState: ", initialAuthState);

// Редуктор для управління станом аутентифікації
export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      const newState = {
        ...state,
        // isLogged: action.payload.isLogged,

        // token: action.payload.token,
        // email: action.payload.email,
      };
      localStorage.setItem("authState", JSON.stringify(newState)); // Save to local storage
      return newState;

    case "LOGOUT":
      localStorage.removeItem("authState"); // Remove from local storage on logout
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
