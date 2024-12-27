import { gql, useQuery } from "@apollo/client";
import React from "react";
import { RestaurantsQuery, RestaurantsQueryVariables } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";

const RESTAURANTS_QUERY = gql(`
  query restaurants ($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        iconImg
        slug
        restaurantCount
      }
    }
    restaurants (input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`);

export const Restaurants = () => {
  const { data, loading, error } = useQuery<RestaurantsQuery, RestaurantsQueryVariables>(
    RESTAURANTS_QUERY,
    { variables: { input: { page: 1 } } }
  );
  return (
    <div>
      <Helmet>
        <title>Restaurants | Yuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <form>
          <input
            type="search"
            className="input rounded-md border-0 w-1/2 min-w-80"
            placeholder="Search restaurants"
          />
        </form>
      </div>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-screen-sm mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col items-center mx-3 cursor-pointer group">
                <div
                  className="w-20 aspect-square rounded-full text-center bg-cover group-hover:bg-green-200 group-hover:-translate-y-1 transition-all"
                  style={{ backgroundImage: `url(${category.iconImg})` }}></div>
                <span className="text-sm font-semibold">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="grid mt-16 grid-flow-row auto-rows-max gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data?.restaurants.results?.map((restaurant) => (
              <div className="cursor-pointer">
                <div
                  className="w-full aspect-square bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${restaurant.coverImg})` }}></div>
                <div className="p-2 text-lg font-bold">{restaurant.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
