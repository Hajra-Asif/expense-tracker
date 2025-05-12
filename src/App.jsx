// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IncomePage from "./pages/IncomePage";
import ExpensePage from "./pages/ExpensePage";
import SupportPage from "./pages/SupportPage";
import Layout from "./Layout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute"; // 👈 Import PublicRoute
import BlogDetail from "./pages/BlogDetail";
import ProfilePage from "./pages/ProfilePage"; // 👈 Import ProfilePage

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Protected Routes */}
        <Route
          index
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="income"
          element={
            <PrivateRoute>
              <IncomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="expenses"
          element={
            <PrivateRoute>
              <ExpensePage />
            </PrivateRoute>
          }
        />
        <Route
          path="support"
          element={
            <PrivateRoute>
              <SupportPage />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="blog/:id"
          element={
            <PrivateRoute>
              <BlogDetail />
            </PrivateRoute>
          }
        />

        {/* Public Routes with PublicRoute protection */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
