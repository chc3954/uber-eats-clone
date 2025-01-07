import { useState } from "react";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { gql, useQuery } from "@apollo/client";
import { CategoryQuery, CategoryQueryVariables } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Restaurants } from "../../components/restaurants";
import { Back } from "../../components/back";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const CategoryPage = () => {
  const [page, setPage] = useState(1);
  const { slug } = useParams();
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: slug || "",
      },
    },
  });

  return (
    <div className="container">
      <Helmet>
        <title>{loading ? "Loading... " : `${data?.category.category?.name} | Yuber Eats`}</title>
      </Helmet>
      {!loading && (
        <>
          <Back />
          <h2 className="text-2xl lg:text-4xl font-bold">{data?.category.category?.name}</h2>
          {data?.category && (
            <Restaurants
              restaurants={data.category.restaurants?.map((restaurant) => ({
                ...restaurant,
                id: restaurant.id + "",
              }))}
              totalPages={data?.category.totalPages ?? 1}
              page={page}
              setPage={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};
