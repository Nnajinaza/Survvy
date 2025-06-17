import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Dashboard/Home";
import OrganizationDetailPage from "./pages/Organization";
import SurveyDetailPage from "./pages/SurveyDetailPage";
import TakeSurveyPage from "./pages/TakeSurveyPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ChangePassword from "./pages/Auth/ChangePassword";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ChangePassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
      <Route
        path="/organizations/:id"
        element={
          <ProtectedRoute>
            <OrganizationDetailPage />
          </ProtectedRoute>
        }
        />
      <Route
        path="/survey/:id"
        element={
          <ProtectedRoute>
            <SurveyDetailPage />
          </ProtectedRoute>
        }
        />
        <Route path="/survey/take/:surveyId" element={<TakeSurveyPage />} />
    </Routes>
  );
};

export default App;
