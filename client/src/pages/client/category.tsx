import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { gql, useQuery } from "@apollo/client";
import { Restaurant } from "../../components/restaurant";
import { CategoryQuery, CategoryQueryVariables } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Restaurants } from "../../components/restaurants";

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

export const Category = () => {
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
          <Link
            to="/"
            className="w-14 lg:w-16 aspect-square text-xl lg:text-3xl font-semibold bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-3 flex items-center justify-center">
            &larr;
          </Link>
          <h2 className="mt-8 text-2xl lg:text-4xl font-bold">{data?.category.category?.name}</h2>
          {data?.category && (
            <Restaurants
              restaurants={data.category.restaurants?.map((restaurant) => ({
                ...restaurant,
                id: restaurant.id.toString(),
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
