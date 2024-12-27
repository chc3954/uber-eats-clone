import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RestaurantsQuery, RestaurantsQueryVariables } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Restaurant } from "../../components/restaurant";
import { Category } from "../../components/category";

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
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<RestaurantsQuery, RestaurantsQueryVariables>(
    RESTAURANTS_QUERY,
    { variables: { input: { page: page } } }
  );

  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  return (
    <div>
      <Helmet>
        <title>Restaurants | Yuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-20 flex items-center justify-center">
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
              <Category
                key={category.id}
                id={category.id + ""}
                iconImg={category.iconImg || ""}
                name={category.name}
                restaurantCount={category.restaurantCount}
              />
            ))}
          </div>
          <div className="grid mt-16 grid-flow-row auto-rows-max gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-sm items-center mx-auto my-10">
            <div>
              <button
                hidden={page === 1}
                className="w-12 h-12 font-medium text-2xl focus:outline-none bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2"
                onClick={onPrevPageClick}>
                &larr;
              </button>
            </div>
            <div className="font-medium text-xl mx-3">
              Page {page} of {data?.restaurants.totalPages}
            </div>
            <div>
              <button
                hidden={page === data?.restaurants.totalPages}
                className="w-12 h-12 font-medium text-2xl focus:outline-none bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2"
                onClick={onNextPageClick}>
                &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
