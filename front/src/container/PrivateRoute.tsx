import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useAuth();
  console.log("PrivateRoute:", token);
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;

// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "./AuthContext";

// // Приватний роут, який перевіряє наявність токена в контексті аутентифікації.
// // Будь-який запит, який відправляється в сторінках під приватним роутом повинні
// // передавати токен (будь-яким варіантом) на сервер для перевірки токена
// // та отримання інформації що за користувач відправляє дані та передати
// // конкретно його дані

// const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const authContext = useContext(AuthContext);
//   console.log("PrivateRoute: authContext", authContext);

//   // Перевіряємо, чи контекст ініціалізований
//   if (!authContext) {
//     // Якщо контекст не ініціалізований, виконуємо відповідну логіку
//     return <Navigate to="/error" />;
//   }

//   // Якщо контекст ініціалізований, отримуємо state
//   const { state } = authContext;
//   console.log("PrivateRoute: state", state);

//   // Перевіряємо, чи є токен
//   if (!state.token || !state.isLogged) {
//     // Якщо немає токена, переадресовуємо на сторінку входу
//     return <Navigate to="/signin" />;
//   }

//   // Якщо є токен, дозволяємо доступ до захищених сторінок
//   return <>{children}</>;
// };

// export default PrivateRoute;
