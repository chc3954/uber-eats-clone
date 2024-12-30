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

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
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
  >(CREATE_RESTAURANT_MUTATION);

  const onCreateRestaurant = () => {
    console.log(getValues());
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <Back />
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onCreateRestaurant)}>
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
        <Button loading={loading} disable={!isValid} actionText="Create Restaurant" />
      </form>
    </div>
  );
};
