import React from "react";
import { Link } from "react-router-dom";

export const Back = () => (
  <Link
    to="/"
    className="w-12 lg:w-14 aspect-square text-lg lg:text-2xl font-semibold bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-3 mb-10 flex items-center justify-center">
    &larr;
  </Link>
);
