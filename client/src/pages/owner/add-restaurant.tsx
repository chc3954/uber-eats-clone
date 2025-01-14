import { gql, useApolloClient, useMutation } from "@apollo/client";
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
import { useState } from "react";

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  coverImg: FileList;
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

export const AddRestaurantPage = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const {
    register,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [createRestaurant] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted: (data: CreateRestaurantMutation) => {
      setUploading(false);
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
                  coverImg: imgUrl,
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
        navigate(`/restaurants/${restaurantId}`);
      }
    },
  });

  const onCreateRestaurant = async () => {
    setUploading(true);
    const { name, address, categoryName, coverImg } = getValues();
    const coverImgFile = coverImg[0];
    const formBody = new FormData();
    formBody.append("file", coverImgFile);
    const { url } = await (
      await fetch("http://localhost:3000/uploads", {
        method: "POST",
        body: formBody,
      })
    ).json();
    setImgUrl(url);

    createRestaurant({
      variables: {
        input: {
          name,
          address,
          categoryName,
          coverImg: url,
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
          <Button loading={uploading} disable={!isValid} actionText="Create Restaurant" />
        </form>
      </div>
    </div>
  );
};
