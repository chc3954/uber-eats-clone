import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../__generated__/graphql";
import { Restaurants } from "../../components/restaurants";
import { Back } from "../../components/back";

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

export const SearchPage = () => {
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
          <Back />
          <h2 className="text-2xl lg:text-4xl font-bold">Search: '{searchTerm}'</h2>
          <Restaurants
            restaurants={data?.searchRestaurant.restaurants?.map((restaurant) => ({
              ...restaurant,
              id: restaurant.id + "",
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
