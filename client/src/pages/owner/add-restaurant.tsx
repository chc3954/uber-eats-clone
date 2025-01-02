import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet";
import { Back } from "../../components/back";
import { useNavigate } from "react-router-dom";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  coverImg: string;
}

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

const temp_coverImg =
  "https://tb-static.uber.com/prod/image-proc/processed_images/b2fdc84b16bbf90b9be3933889bba804/30be7d11a3ed6f6183354d1933fbb6c7.jpeg";

export const AddRestaurantPage = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [createRestaurant, { loading, data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
    onCompleted: (data: CreateRestaurantMutation) => {
      const { ok, restaurantId } = data.createRestaurant;

      if (ok) {
        const { name, address, categoryName } = getValues();
        const query = client.readQuery({ query: MY_RESTAURANTS_QUERY });
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...query.myRestaurants,
              restaurants: [
                {
                  __typename: "Restaurant",
                  id: restaurantId,
                  name,
                  address,
                  coverImg: temp_coverImg,
                  category: {
                    __typename: "Category",
                    name: categoryName,
                  },
                  isPromoted: false,
                },
                ...query.myRestaurants.restaurants,
              ],
            },
          },
        });
        navigate("/");
      }
    },
  });

  const onCreateRestaurant = () => {
    const { name, address, categoryName, coverImg } = getValues();

    createRestaurant({
      variables: {
        input: {
          name,
          address,
          categoryName,
          coverImg: temp_coverImg,
        },
      },
    });
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <Back />
      <div className="flex flex-col items-center ">
        <h1>Add Restaurant</h1>
        <form
          onSubmit={handleSubmit(onCreateRestaurant)}
          className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Name"
            className="input"
          />
          <input
            {...register("address", { required: "Address is required" })}
            type="text"
            placeholder="Address"
            className="input"
          />
          <input
            {...register("categoryName", { required: "Category Name is required" })}
            type="text"
            placeholder="Category Name"
            className="input"
          />
          <input
            {...register("coverImg", { required: "Image is required" })}
            type="file"
            accept="image/*"
          />
          <Button loading={loading} disable={!isValid} actionText="Create Restaurant" />
        </form>
      </div>
    </div>
  );
};
