import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../__generated__/graphql";
import { Restaurants } from "../../components/restaurants";

const SEARCH_QUERY = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
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
`;

export const Search = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { search } = useLocation();
  const [callQuery, { data, loading }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_QUERY);

  useEffect(() => {
    const [_, term] = search.split("?term=");
    if (!term) {
      navigate("/", { replace: true });
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query: term,
        },
      },
    });
    setSearchTerm(term);
  }, [navigate, search]);

  return (
    <>
      <Helmet>
        <title>{loading ? "Loading... " : `Search '${searchTerm}' | Yuber Eats`}</title>
      </Helmet>
      {!loading && (
        <div className="container">
          <Link
            to="/"
            className="w-14 lg:w-16 aspect-square text-xl lg:text-3xl font-semibold bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-3 flex items-center justify-center">
            &larr;
          </Link>
          <h2 className="mt-8 text-2xl lg:text-4xl font-bold">Search: '{searchTerm}'</h2>
          <Restaurants
            restaurants={data?.searchRestaurant.restaurants?.map((restaurant) => ({
              ...restaurant,
              id: restaurant.id.toString(),
            }))}
            totalPages={data?.searchRestaurant.totalPages || 1}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </>
  );
};
