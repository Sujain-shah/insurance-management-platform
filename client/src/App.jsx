import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import Claims from "./pages/Claims";
import PremiumPayments from "./pages/PremiumPayments";
import Documents from "./pages/Documents";
import Register from "./pages/Register";
import MyPolicies from "./pages/MyPolicies";
import MyClaims from "./pages/MyClaims";
import MyPayments from "./pages/MyPayments";
import Profile from "./pages/Profile";
import CustomerHistory from "./pages/CustomerHistory";
import SubmitClaim from "./pages/SubmitClaim";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policies"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
              <Policies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/premium-payments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
              <PremiumPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
              <Documents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-policies"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyPolicies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-claims"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyClaims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-payments"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-claim"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <SubmitClaim />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );


}

export default App;