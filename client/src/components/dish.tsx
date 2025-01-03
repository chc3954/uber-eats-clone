import React from "react";

interface IDishProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  photo?: string;
}

export const Dish: React.FC<IDishProps> = ({ id, name, description, price, photo }) => {
  return (
    <div className="w-full border hover:border-gray-800 rounded transition-all flex justify-between">
      <div className="p-5">
        <h3 className="text-lg font-semibold">{name}</h3>
        <h4 className="mb-5">{description}</h4>
        <span className="font-medium">${price.toFixed(2)}</span>
      </div>
      <div
        className="m-2 aspect-square bg-cover bg-center rounded"
        style={{ backgroundImage: `url(${photo})` }}></div>
    </div>
  );
};
