import React from "react";
import { DishOption, Maybe } from "../__generated__/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

interface IDishProps {
  id: number;
  name: string;
  description?: string;
  price: number;
  photo?: string | null;
  options?: Maybe<Array<DishOption>>;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  handleClickItem?: (dishId: number, options: Maybe<Array<DishOption>>) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id,
  name,
  description,
  price,
  photo = "",
  options = [],
  isCustomer = false,
  orderStarted = false,
  isSelected = false,
  handleClickItem,
}) => {
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
          <span
            className=""
            onClick={() => (!orderStarted && handleClickItem ? handleClickItem(id, []) : null)}>
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
          <div className="flex items-center text-sm mt-1">
            {options?.map((option, index) => (
              <span
                key={index}
                onClick={() => (!orderStarted && handleClickItem ? handleClickItem(id, []) : null)}
                className="flex items-center mr-2 cursor-pointer">
                <h6 className="text-sm opacity-75 border px-2 py-1 rounded hover:border-gray-800">
                  {option.name}(+${option.extra})
                </h6>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
