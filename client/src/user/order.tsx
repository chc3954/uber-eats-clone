import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GetOrderQuery, GetOrderQueryVariables } from "../__generated__/graphql";

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

export const OrderPage = () => {
  const { id } = useParams() as { id: string };
  const { data } = useQuery<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER_QUERY, {
    variables: { input: { id: +id } },
  });

  return (
    <div className="mt-32 container flex justify-center">
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
          <span className=" text-center mt-5 mb-3  text-2xl text-green-600">
            Status: {data?.getOrder.order?.status}
          </span>
        </div>
      </div>
    </div>
  );
};
