import { gql, useQuery } from "@apollo/client";
import React from "react";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantsQuery } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurantsPage = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);

  return (
    <div className="container mt-32">
      <Helmet>
        <title>My Restaurants | Yuber Eats</title>
      </Helmet>
      {data?.myRestaurants.ok && data?.myRestaurants.restaurants?.length === 0 && (
        <>
          <h4 className="text-xl mb-5">You have no restaurants.</h4>
          <Link className="link" to="/add-restaurant">
            Create one &rarr;
          </Link>
        </>
      )}
    </div>
  );
};
