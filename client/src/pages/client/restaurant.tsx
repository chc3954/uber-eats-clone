import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { RestaurantQuery, RestaurantQueryVariables } from "../../__generated__/graphql";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const RestaurantPage = () => {
  const { id } = useParams() as { id: string };
  const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });

  return (
    <div>
      <div
        className="py-12 lg:py-40 bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}>
        <div className="bg-white opacity-95 rounded-r shadow inline-block p-8 pl-12 lg:pl-48">
          <h4 className="text-2xl lg:text-4xl font-semibold mb-2">
            {data?.restaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light">{data?.restaurant.restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
        </div>
      </div>
      <div className="container"></div>
    </div>
  );
};
