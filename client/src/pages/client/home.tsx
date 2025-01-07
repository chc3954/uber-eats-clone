import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { RestaurantsQuery, RestaurantsQueryVariables } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Categories } from "../../components/categories";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Restaurants } from "../../components/restaurants";

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

export const HomePage = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<RestaurantsQuery, RestaurantsQueryVariables>(
    RESTAURANTS_QUERY,
    { variables: { input: { page: page } } }
  );

  return (
    <div>
      <Helmet>
        <title>Home | Yuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-20 flex items-center justify-center"></div>
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
              id: restaurant.id + "",
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
