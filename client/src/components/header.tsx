import React from "react";
import logo from "../images/uber-eats.svg";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <header className="py-4 px-4 lg:px-8">
      <div className="w-full max-w-screen bg-white mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={logo} className="w-24" />
        </Link>
        <span className="text-sm">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} /> {data?.me.email}
          </Link>
        </span>
      </div>
    </header>
  );
};
