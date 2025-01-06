import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  CreateOrderItemInputType,
  DishOption,
  Maybe,
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Dish } from "../../components/dish";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

export const RestaurantPage = () => {
  const { id } = useParams() as { id: string };
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInputType[]>([]);
  const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });

  const onMakeOrder = () => {
    setOrderStarted(true);
    console.log(orderItems);
  };

  const isSelected = (dishId: number): boolean => {
    return !!orderItems.find((item) => item.dishId === dishId);
  };

  const onClickItem = (dishId: number, selectedOption: Maybe<Array<DishOption>>) => {
    if (orderStarted) {
      return;
    }

    setOrderItems((current: CreateOrderItemInputType[]) =>
      isSelected(dishId)
        ? current.filter((item) => item.dishId !== dishId)
        : [{ dishId, options: selectedOption }, ...current]
    );
  };

  return (
    <div>
      <div
        className="py-12 lg:py-40 bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}>
        <div className="bg-white opacity-95 rounded-r shadow inline-block p-8 pl-36 lg:pl-48">
          <h4 className="text-2xl lg:text-4xl font-semibold mb-2">
            {data?.restaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light">{data?.restaurant.restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-10">
        <button onClick={onMakeOrder} className="button">
          {orderStarted ? "Ordering..." : "Start Order"}
        </button>
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
          {data?.restaurant.restaurant?.menu?.map((dish, index) => (
            <Dish
              isSelected={isSelected(dish.id)}
              key={index}
              id={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              photo={dish.photo}
              isCustomer={true}
              options={dish.options}
              orderStarted={orderStarted}
              handleClickItem={onClickItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
