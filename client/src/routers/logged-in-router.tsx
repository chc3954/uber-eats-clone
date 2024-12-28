import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../pages/client/home";
import { NotFound } from "../pages/NotFound";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../user/confirm-email";
import { MyProfile } from "../user/my-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";

const ClientRoutes = [
  <Route key={1} path="/confirm" element={<ConfirmEmail />} />,
  <Route key={2} path="/" element={<Home />} />,
  <Route key={3} path="/my-profile" element={<MyProfile />} />,
  <Route key={4} path="/search" element={<Search />} />,
  <Route key={5} path="/category/:slug" element={<Category />} />,
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
