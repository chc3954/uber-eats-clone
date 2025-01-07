import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  CreateOrderItemInputType,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";

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
      orderId
      error
    }
  }
`;

export const RestaurantPage = () => {
  const navigate = useNavigate();
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
  const [createOrderMutation, { loading }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted: (data: CreateOrderMutation) => {
      const { ok, orderId } = data.createOrder;
      if (ok) {
        setOrderStarted(false);
        setOrderItems([]);
        navigate(`/orders/${orderId}`);
      }
    },
  });

  const onStartOrder = () => {
    setOrderStarted(true);
    console.log(orderItems);
  };

  const getItem = (dishId: number) => orderItems.find((order) => order.dishId === dishId);

  const isSelected = (dishId: number) => Boolean(getItem(dishId));

  const addItemToOrder = (dishId: number) =>
    !isSelected(dishId) && setOrderItems((current) => [{ dishId, options: [] }, ...current]);

  const removeFromOrder = (dishId: number) =>
    setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(oldItem.options?.find((aOption) => aOption.name == optionName));
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter((option) => option.name !== optionName),
        },
        ...current,
      ]);
    }
  };

  const getOptionFromItem = (item: CreateOrderItemInputType, optionName: string) =>
    item.options?.find((option) => option.name === optionName);

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    return item && Boolean(getOptionFromItem(item, optionName));
  };

  const onCancelOrder = () => setOrderStarted(false);

  const onConfirmOrder = () => {
    if (!loading) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +id,
            items: orderItems,
          },
        },
      });
    }
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
        {!orderStarted ? (
          <button onClick={onStartOrder} className="button" disabled={orderItems.length === 0}>
            Order
          </button>
        ) : (
          <div className="flex items-center">
            <button onClick={onConfirmOrder} className="button">
              Confirm Order
            </button>
            <button onClick={onCancelOrder} className="button !bg-red-500 hover:!bg-red-700 ml-3">
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
          {data?.restaurant.restaurant?.menu?.map((dish, index) => (
            <Dish
              isSelected={isSelected(dish.id)}
              key={index}
              id={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              photo={dish.photo + ""}
              isCustomer={true}
              options={dish.options}
              orderStarted={orderStarted}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}>
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  isSelected={!!isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
