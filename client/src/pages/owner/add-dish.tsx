import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/button";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

interface IFromProps {
  name: string;
  price: string;
  description: string;
}

const CREATE_DISH_MUTATION = gql`
  mutation createDish($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput) {
      ok
      error
    }
  }
`;

export const AddDishPage = () => {
  const navigate = useNavigate();
  const { id: restaurantId } = useParams() as { id: string };
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IFromProps>({
    mode: "onChange",
  });
  const [createDish, { loading }] = useMutation<CreateDishMutation, CreateDishMutationVariables>(
    CREATE_DISH_MUTATION,
    {
      refetchQueries: [{ query: MY_RESTAURANT_QUERY, variables: { input: { id: +restaurantId } } }],
    }
  );

  const onAddDish = () => {
    const { name, price, description } = getValues();
    createDish({
      variables: {
        createDishInput: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    navigate(-1);
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onAddDish)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input
          {...register("name", { required: "Name is required." })}
          className="input"
          type="text"
          placeholder="Name"
        />
        <input
          {...register("price", { required: "Price is required." })}
          className="input"
          type="number"
          min={0}
          placeholder="Price"
        />
        <input
          {...register("description", { required: "Description is required." })}
          className="input"
          type="text"
          placeholder="Description"
        />
        <Button loading={loading} disable={!isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
