import React from "react";

interface ICategoryProps {
  id: string;
  name: string;
  iconImg?: string;
  restaurantCount: number;
}

export const Category: React.FC<ICategoryProps> = ({ id, name, iconImg, restaurantCount }) => (
  <div className="flex flex-col items-center mx-3 cursor-pointer group">
    <div
      className="w-20 aspect-square rounded-full text-center bg-cover group-hover:bg-green-200 group-hover:-translate-y-1 transition-all"
      style={{ backgroundImage: `url(${iconImg})` }}></div>
    <span className="text-sm font-semibold">{name}</span>
  </div>
);
