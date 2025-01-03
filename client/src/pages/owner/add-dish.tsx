import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/button";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

interface IFromProps {
  name: string;
  price: string;
  description: string;
  [options: string]: string;
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
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const { id: restaurantId } = useParams() as { id: string };
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
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
    const { name, price, description, ...options } = getValues();
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

  const onAddOption = () => {
    setOptionsNumber((current) => [...current, +uuidv4()]);
  };

  const onDeleteOption = (optionId: number) => {
    setValue(`optionName-${optionId}`, "");
    setValue(`optionExtra-${optionId}`, "");
    setOptionsNumber((current) => current.filter((id) => id !== optionId));
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
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Option</h4>
          <span
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
            onClick={onAddOption}>
            Add Dish Option
          </span>
          {optionsNumber.length > 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`optionName-${id}`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  {...register(`optionExtra-${id}`, { valueAsNumber: true })}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />
                <span
                  className="cursor-pointer text-gray-500 hover:text-red-400 py-3 px-4"
                  onClick={() => onDeleteOption(id)}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </span>
              </div>
            ))}
        </div>
        <Button loading={loading} disable={!isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
