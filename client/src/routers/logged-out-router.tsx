import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CreateAccountPage } from "../pages/create-account";
import { LoginPage } from "../pages/login";
export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </Router>
  );
};
