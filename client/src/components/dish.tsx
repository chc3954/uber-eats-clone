import React from "react";
import { DishOption, Maybe } from "../__generated__/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  photo?: string;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: Maybe<Array<DishOption>> | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  children?: React.ReactNode;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  photo = "",
  isCustomer = false,
  orderStarted = false,
  options,
  isSelected,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const handleClickItem = () => {
    if (!orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`w-full border rounded transition-all flex justify-between ${
        isSelected && "border-gray-900 shadow-lg"
      }`}>
      <div
        className="m-2 aspect-square bg-cover bg-center rounded"
        style={{ backgroundImage: `url(${photo})` }}></div>
      <div className="w-full flex flex-col p-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="" onClick={handleClickItem} hidden={!isCustomer}>
            <FontAwesomeIcon
              icon={faCirclePlus}
              className={`text-3xl cursor-pointer transition-transform ${
                isSelected
                  ? "text-red-500 hover:text-red-700 rotate-45"
                  : "text-green-600 hover:text-green-800"
              }`}
            />
          </span>
        </div>
        <h4 className="mb-5 h-full text-xs">{description}</h4>
        <span className="font-semibold">${price.toFixed(2)}</span>
        {isCustomer && options?.length !== 0 && (
          <div className="flex items-center text-sm mt-1">{dishOptions}</div>
        )}
      </div>
    </div>
  );
};
