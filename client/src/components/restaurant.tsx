import { faAward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
  isPromoted: boolean;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg = "",
  name,
  categoryName,
  isPromoted,
}) => (
  <Link to={`/restaurants/${id}`}>
    <div className="cursor-pointer">
      <div
        className="w-full aspect-square bg-cover bg-center rounded-lg relative"
        style={{ backgroundImage: `url(${coverImg})` }}>
        {isPromoted && (
          <div className="absolute left-2 top-2 opacity-95 p-1 bg-green-600 rounded text-xs text-white font-semibold">
            <FontAwesomeIcon icon={faAward} /> Promoted
          </div>
        )}
      </div>
      <div className="p-2 text-lg font-bold">{name}</div>
      <div className="px-2 py-1 border-t-[0.5px] border-gray-300 text-xs text-gray-500">
        {categoryName}
      </div>
    </div>
  </Link>
);
