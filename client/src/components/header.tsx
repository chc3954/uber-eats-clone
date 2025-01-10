import React, { useEffect, useRef, useState } from "react";
import logo from "../images/uber-eats.svg";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

interface ISearchForm {
  searchTerm: string;
}

export const Header: React.FC = () => {
  const { data } = useMe();
  const navigate = useNavigate();
  const [showBox, setShowBox] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, getValues, watch, setValue } = useForm<ISearchForm>();

  useEffect(() => {
    setShowBox(false);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef]);

  const onSearch = () => {
    const { searchTerm } = getValues();
    navigate({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  const onClearSearch = () => {
    setValue("searchTerm", "");
  };

  const onToggleBox = () => {
    setShowBox((prev) => !prev);
  };

  const onLogout = () => {
    localStorage.removeItem("yuber-eats-token");
    window.location.reload();
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-xs text-white">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="py-2 px-4 lg:px-8">
        <div className="w-full max-w-screen bg-white mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={logo} className="w-24" />
          </Link>
          <form className="w-2/3 max-w-screen-sm text-md" onSubmit={handleSubmit(onSearch)}>
            <div className="relative flex items-center">
              <input
                {...register("searchTerm", { required: true, min: 3 })}
                type="search"
                className="w-full pl-12 py-2 rounded-full bg-gray-200 border-2 border-white font-light focus:outline-none focus:border-gray-500 transition-colors"
                placeholder="Search restaurants"
              />
              <span className="absolute left-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              {watch("searchTerm") && (
                <span className="absolute right-4">
                  <button
                    type="button"
                    className="text-md text-gray-600 rounded-full"
                    onClick={onClearSearch}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                </span>
              )}
            </div>
          </form>
          <div className="text-sm relative" ref={boxRef}>
            <div onClick={onToggleBox} className="flex items-center justify-center cursor-pointer">
              <div className="mr-2 lg:inline-block">{data?.me.email}</div>
              <FontAwesomeIcon icon={faUser} className="p-2 block bg-gray-200 rounded-full" />
            </div>
            <div
              className={`absolute m-1 bg-white border-2 shadow rounded flex flex-col z-10 ${
                showBox ? "block" : "hidden"
              }`}>
              <Link to="/my-profile" className="p-3 border-b hover:bg-gray-200">
                My Profile
              </Link>
              <Link to="/orders" className="p-3 border-b hover:bg-gray-200">
                Ordres
              </Link>
              <div className="p-3 border-b hover:bg-gray-200 cursor-pointer" onClick={onLogout}>
                Log Out
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
