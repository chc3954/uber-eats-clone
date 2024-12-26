import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { NotFound } from "../pages/NotFound";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";

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
        {data.me.role === "Client" && <Route path="/" element={<Restaurants />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
