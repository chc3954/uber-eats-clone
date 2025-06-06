import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  addOptionToItem,
  removeOptionFromItem,
  dishId,
}) => {
  const onClick = () =>
    isSelected ? removeOptionFromItem(dishId, name) : addOptionToItem(dishId, name);

  return (
    <span
      onClick={onClick}
      className={`border rounded cursor-pointer mr-1 px-2 py-1 ${
        isSelected ? "border-gray-800 shadow" : "hover:border-gray-800"
      }`}>
      <span className="mr-1">{name}</span>
      {<span className="text-sm opacity-75">(${extra})</span>}
    </span>
  );
};
