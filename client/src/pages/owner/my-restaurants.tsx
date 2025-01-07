import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantsQuery } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";

export const MY_RESTAURANTS_QUERY = gql`
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
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-semibold inline-block">My Restaurants</h2>
        <Link
          className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
          to="/add-restaurant">
          + Add Restaurant
        </Link>
      </div>
      {data?.myRestaurants.ok && data?.myRestaurants.restaurants?.length === 0 ? (
        <>
          <h4 className="text-xl mb-5">You have no restaurants.</h4>
          <Link className="link" to="/add-restaurant">
            Add one &rarr;
          </Link>
        </>
      ) : (
        <div className="responsive-grid">
          {data?.myRestaurants.restaurants?.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id + ""}
              coverImg={restaurant.coverImg}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
              isPromoted={restaurant.isPromoted}
            />
          ))}
        </div>
      )}
    </div>
  );
};
