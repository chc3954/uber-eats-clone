import { gql, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__generated__/graphql";
import { get, useFieldArray, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/button";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface IFormProps {
  name: string;
  price: string;
  description: string;
  options: { optionName: string; optionExtra: number }[];
  photo: string;
}

const CREATE_DISH_MUTATION = gql`
  mutation createDish($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput) {
      ok
      error
    }
  }
`;

const temp_img =
  "https://media.istockphoto.com/id/1170315961/photo/white-plate-wooden-table-tablecloth-rustic-wooden-clean-copy-freepik-table-top-view-wallpaper.jpg?s=612x612&w=0&k=20&c=DHB3nUXj-OpIzWIN__QfyK--thApc9UIH-tDSzEGLWA=";

export const AddDishPage = () => {
  const navigate = useNavigate();
  const { id: restaurantId } = useParams() as { id: string };
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
    shouldUnregister: true,
  });
  const { fields, append, remove } = useFieldArray<IFormProps>({
    control,
    name: "options",
  });
  const [createDish, { loading }] = useMutation<CreateDishMutation, CreateDishMutationVariables>(
    CREATE_DISH_MUTATION,
    {
      refetchQueries: [{ query: MY_RESTAURANT_QUERY, variables: { input: { id: +restaurantId } } }],
    }
  );

  const onAddDish = () => {
    const { name, price, description, ...rest } = getValues();
    const optionObjects = rest.options.map((option, _) => ({
      name: option.optionName,
      extra: option.optionExtra,
    }));

    createDish({
      variables: {
        createDishInput: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObjects,
          photo: temp_img,
        },
      },
    });
    navigate(-1);
  };

  const onAddOption = () => {
    append({ optionName: "", optionExtra: 0 });
  };

  const onRemoveOption = (index: number) => {
    remove(index);
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
          {fields.map((field, index) => (
            <div key={field.id} className="mt-5">
              <input
                {...register(`options.${index}.optionName` as const)}
                className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                type="text"
                placeholder="Option Name"
              />
              <input
                {...register(`options.${index}.optionExtra` as const, { valueAsNumber: true })}
                className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                type="number"
                min={0}
                placeholder="Option Extra"
              />
              <span
                className="cursor-pointer text-gray-500 hover:text-red-400 py-3 px-4"
                onClick={() => onRemoveOption(index)}>
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
