import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  UserRole,
} from "../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useEffect } from "react";
import { useMe } from "../hooks/useMe";

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

export const OrderPage = () => {
  const { id } = useParams() as { id: string };
  const { data: userData } = useMe();
  const [editOrder] = useMutation<EditOrderMutation, EditOrderMutationVariables>(
    EDIT_ORDER_MUTATION
  );
  const { data, subscribeToMore } = useQuery<GetOrderQuery, GetOrderQueryVariables>(
    GET_ORDER_QUERY,
    {
      variables: { input: { id: +id } },
    }
  );

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +id,
          },
        },
        // @ts-expect-error: TypeScript does not recognize the subscriptionData type
        updateQuery: (
          prev,
          { subscriptionData: { data } }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev;

          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore]);

  const onEditOrderStatus = (newStatus: OrderStatus) => {
    editOrder({
      variables: {
        input: {
          id: +id,
          status: newStatus,
        },
      },
    });
  };

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title> Order #{id} | Yuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">Order #{id}</h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total?.toFixed(2)}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:&nbsp;
            <span className="font-medium">{data?.getOrder.order?.restaurant?.name}</span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:&nbsp;
            <span className="font-medium">{data?.getOrder.order?.customer?.email}</span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:&nbsp;
            <span className="font-medium">{data?.getOrder.order?.driver?.email || "Not yet"}</span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-5 mb-3  text-2xl text-green-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending ? (
                <button className="button" onClick={() => onEditOrderStatus(OrderStatus.Cooking)}>
                  Accept Order
                </button>
              ) : data?.getOrder.order?.status === OrderStatus.Cooking ? (
                <button className="button" onClick={() => onEditOrderStatus(OrderStatus.Cooked)}>
                  Ready to Pickup
                </button>
              ) : (
                <span className=" text-center mt-5 mb-3  text-2xl text-green-600">
                  Status: {data?.getOrder.order?.status}
                </span>
              )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked ? (
                <button className="button" onClick={() => onEditOrderStatus(OrderStatus.PickedUp)}>
                  Picked Up
                </button>
              ) : data?.getOrder.order?.status === OrderStatus.PickedUp ? (
                <button className="button" onClick={() => onEditOrderStatus(OrderStatus.Delivered)}>
                  Delivered
                </button>
              ) : (
                <span className=" text-center mt-5 mb-3  text-2xl text-green-600">
                  Status: {data?.getOrder.order?.status}
                </span>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className=" text-center mt-5 mb-3  text-2xl text-green-600">
              Thank you for using Yuber Eats
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
