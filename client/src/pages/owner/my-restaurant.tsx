import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  CreatePaymentMutation,
  CreatePaymentMutationVariables,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  PendingOrdersSubscription,
} from "../../__generated__/graphql";
import { Dish } from "../../components/dish";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";
import { Helmet } from "react-helmet-async";
import { useMe } from "../../hooks/useMe";
import { Back } from "../../components/back";
import { useEffect } from "react";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const MyRestaurantPage = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data: userData } = useMe();
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });

  const [createPayment] = useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(
    CREATE_PAYMENT_MUTATION,
    {
      onCompleted: (data: CreatePaymentMutation) => {
        if (data.createPayment.ok) {
          alert("Your restaurant is promoted!");
        }
      },
    }
  );

  const { data: subscriptionData } = useSubscription<PendingOrdersSubscription>(
    PENDING_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      navigate(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  const onBuyPromotion = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const Paddle = window.Paddle;
    Paddle.Checkout.open({
      product: "pro_01jgq9zzp3r5y020wsfch2hhq2",
      email: userData?.me.email,
      successCallback: (data: { checkout: { id: string } }) => {
        createPayment({
          variables: {
            input: {
              transactionId: data.checkout.id,
              restaurantId: +id,
            },
          },
        });
      },
    });
  };

  return (
    <div>
      <Helmet>
        <title>{data?.myRestaurant.restaurant?.name || "Loading..."} | Nuber Eats</title>
        <meta
          http-equiv="Content-Security-Policy"
          content="frame-ancestors 'self' http://localhost;"
        />
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Helmet>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}></div>
      <div className="container mt-10">
        <Back />
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link to={"add-dish"} className="mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <span
          onClick={onBuyPromotion}
          className="text-white bg-green-600 py-3 px-10 cursor-pointer">
          Buy Promotion &rarr;
        </span>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu?.map((dish, index) => (
                <Dish
                  key={index}
                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  photo={dish.photo + ""}
                />
              ))}
            </div>
          )}
        </div>
        <div className="my-16">
          <h4 className="text-center text-2xl font-semibold">Sales</h4>
          <div className="mx-auto">
            <VictoryChart
              theme={VictoryTheme.material}
              width={window.innerWidth}
              height={500}
              containerComponent={
                <VictoryVoronoiContainer labels={({ datum }) => `y: ${datum.y.toFixed(2)}`} />
              }>
              <VictoryLine
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation={"natural"}
              />
              <VictoryAxis dependentAxis tickFormat={(tick) => `$${tick.toFixed(0)}`} />
              <VictoryAxis tickFormat={(tick) => new Date(tick).toLocaleDateString()} />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
