import React from "react";
import { Link } from "react-router-dom";

interface ICategoryProps {
  id: string;
  name: string;
  iconImg?: string;
  slug: string;
  restaurantCount: number;
}

export const Categories: React.FC<ICategoryProps> = ({
  id,
  name,
  iconImg,
  slug,
  restaurantCount,
}) => (
  <Link to={`/category/${slug}`}>
    <div className="flex flex-col items-center mx-3 cursor-pointer group">
      <div
        className="w-20 aspect-square rounded-full text-center bg-cover group-hover:bg-green-200 group-hover:-translate-y-1 transition-all"
        style={{ backgroundImage: `url(${iconImg})` }}></div>
      <span className="text-sm font-semibold">{name}</span>
    </div>
  </Link>
);
