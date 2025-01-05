import React from "react";
import { DishOption, Maybe } from "../__generated__/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

interface IDishProps {
  id: number;
  name: string;
  description?: string;
  price: number;
  photo?: string | null;
  isCustomer?: boolean;
  options?: Maybe<Array<DishOption>>;
  orderStarted?: boolean;
  handleClickItem?: (dishId: number) => void;
  isSelected?: boolean;
}

export const Dish: React.FC<IDishProps> = ({
  id,
  name,
  description,
  price,
  photo = "",
  isCustomer = false,
  options,
  orderStarted = false,
  handleClickItem,
  isSelected = false,
}) => {
  return (
    <div
      onClick={() => (!orderStarted && handleClickItem ? handleClickItem(id) : null)}
      className={`w-full border rounded transition-all flex justify-between ${
        isSelected ? "border-gray-800 bg-green-400 bg-opacity-10" : "hover:border-gray-800"
      }`}>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{name}</h3>
        <h4 className="mb-5 text-xs">{description}</h4>
        <span className="font-semibold">${price.toFixed(2)}</span>
        {isCustomer && options?.length !== 0 && (
          <div className="flex text-sm mt-1">
            <h5>Options:&nbsp;</h5>
            {options?.map((option, index) => (
              <span key={index} className="flex items-center mr-1">
                <h6 className="text-sm opacity-75">
                  {option.name}(+${option.extra})
                </h6>
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        className="m-2 p-5 aspect-square bg-cover bg-center rounded"
        style={{ backgroundImage: `url(${photo})` }}>
        {isSelected && <FontAwesomeIcon icon={faCircleCheck} className="h-full text-green-500" />}
      </div>
    </div>
  );
};
