import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "./page/welcome";

import SignupPage from "./page/signup";

import SignupConfirmPage from "./page/signupConfirm";

import SigninPage from "./page/signin";

import RecoveryPage from "./page/recovery";

import RecoveryConfirmPage from "./page/recoveryConfirm";

import BalancePage from "./page/balance";

import NotificationsPage from "./page/notifications";

import SettingsPage from "./page/settings";

import RecivePage from "./page/recive";

import SendPage from "./page/send";

import TransactionPage from "./page/transaction";

// const AuthContext = null;

// const AuthRoute = () => {};

// const PrivateRoute = () => {};

function App() {
  return (
    // <AuthContext.Provider value={authContextData}>
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            // <AuthRoute>
            <WelcomePage />
            // </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            // <AuthRoute>
            <SignupPage />
            // </AuthRoute>
          }
        />
        <Route
          path="/signup-confirm"
          element={
            // <PrivateRoute>
            <SignupConfirmPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/signin"
          element={
            // <AuthRoute>
            <SigninPage />
            // </AuthRoute>
          }
        />
        <Route
          path="/recovery"
          element={
            // <AuthRoute>
            <RecoveryPage />
            // </AuthRoute>
          }
        />
        <Route
          path="/recovery-confirm"
          element={
            // <AuthRoute>
            <RecoveryConfirmPage />
            // </AuthRoute>
          }
        />
        <Route
          path="/balance"
          element={
            // <PrivateRoute>
            <BalancePage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            // <PrivateRoute>
            <NotificationsPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            // <PrivateRoute>
            <SettingsPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/recive"
          element={
            // <PrivateRoute>
            <RecivePage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/send"
          element={
            // <PrivateRoute>
            <SendPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/transaction/:transactionId"
          element={
            // <PrivateRoute>
            <TransactionPage />
            // </PrivateRoute>
          }
        />
        {/* <Route path="*" Component={Error} />  */}
      </Routes>
    </BrowserRouter>
    // </AuthContext.Provider>
  );
}

export default App;
