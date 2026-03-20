import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Borrowers from "./pages/Borrowers";
import CustomerDetails from "./pages/CustomerDetails";
import OverDue from "./pages/overDue";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users";
import AdminAnalytics from "./components/AdminAnalytics";
import AgentLeaderboard from "./components/AgentLeaderboard";
import "./index.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />

        {/* Admin routes */}
        <Route
          path="/AdminAnalytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AgentLeaderboard"
          element={
            <ProtectedRoute allowedRoles={["teamleader", "admin"]}>
              {/* <AgentLeaderboard /> */}
            </ProtectedRoute>
          }
        />

        {/* General protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/OverDue"
          element={
            <ProtectedRoute>
              <OverDue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CustomerDetails"
          element={
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowers"
          element={
            <ProtectedRoute>
              <Borrowers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overdue"
          element={
            <ProtectedRoute>
              <OverDue />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;