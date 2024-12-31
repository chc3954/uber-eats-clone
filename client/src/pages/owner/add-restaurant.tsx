import { gql, useMutation } from "@apollo/client";
import React from "react";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet";
import { Back } from "../../components/back";
import { useNavigate } from "react-router-dom";

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
    }
  }
`;

export const AddRestaurantPage = () => {
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
    onCompleted: (data: CreateRestaurantMutation) => {
      const { ok, error } = data.createRestaurant;
      if (ok) {
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
          coverImg:
            "https://yuber-eats.s3.us-east-1.amazonaws.com/istockphoto-1170315961-612x612.jpg",
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
