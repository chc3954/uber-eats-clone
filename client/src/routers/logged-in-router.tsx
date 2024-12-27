import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { NotFound } from "../pages/NotFound";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../user/confirm-email";
import { MyProfile } from "../user/my-profile";

const ClientRoutes = [
  <Route key={1} path="/confirm" element={<ConfirmEmail />} />,
  <Route key={2} path="/" element={<Restaurants />} />,
  <Route key={3} path="/my-profile" element={<MyProfile />} />,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center font-medium tracking-wider">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === "Client" && ClientRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
