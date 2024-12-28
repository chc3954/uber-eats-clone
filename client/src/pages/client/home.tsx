import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RestaurantsQuery, RestaurantsQueryVariables } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Restaurant } from "../../components/restaurant";
import { Categories } from "../../components/categories";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Restaurants } from "../../components/restaurants";

interface ISearchForm {
  searchTerm: string;
}

const RESTAURANTS_QUERY = gql`
  query restaurants($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Home = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<RestaurantsQuery, RestaurantsQueryVariables>(
    RESTAURANTS_QUERY,
    { variables: { input: { page: page } } }
  );
  const { register, handleSubmit, getValues } = useForm<ISearchForm>();

  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  const onSearch = () => {
    const { searchTerm } = getValues();
    navigate({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Yuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-20 flex items-center justify-center">
        <form onSubmit={handleSubmit(onSearch)}>
          <input
            {...register("searchTerm", { required: true, min: 3 })}
            type="search"
            className="input rounded-md border-0 w-1/2 min-w-80"
            placeholder="Search restaurants"
          />
        </form>
      </div>
      {!loading && (
        <div className="container">
          <div className="flex justify-around max-w-screen-sm mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Categories
                key={category.id}
                id={category.id + ""}
                iconImg={category.iconImg || ""}
                name={category.name}
                slug={category.slug}
                restaurantCount={category.restaurantCount}
              />
            ))}
          </div>
          <Restaurants
            restaurants={data?.restaurants.restaurants?.map((restaurant) => ({
              ...restaurant,
              id: restaurant.id.toString(),
            }))}
            totalPages={data?.restaurants.totalPages || 1}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};
