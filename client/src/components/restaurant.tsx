import React from "react";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg = "",
  name,
  categoryName,
}) => (
  <div className="cursor-pointer">
    <div
      className="w-full aspect-square bg-cover bg-center rounded-lg"
      style={{ backgroundImage: `url(${coverImg})` }}></div>
    <div className="p-2 text-lg font-bold">{name}</div>
    <div className="px-2 py-1 border-t-[0.5px] border-gray-300 text-xs text-gray-400">
      {categoryName}
    </div>
  </div>
);
