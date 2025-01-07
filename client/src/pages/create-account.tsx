import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import logo from "../images/uber-eats.svg";
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../__generated__/graphql";

interface IFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export const CreateAccountPage = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const [createAccount, { loading, data: result }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted: (data: CreateAccountMutation) => {
      const { ok, error } = data.createAccount;
      if (ok) {
        console.log("Account Created! Please Log in");
        navigate("/");
      } else {
        console.log(error);
      }
    },
  });

  const onCreateAccount = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccount({ variables: { createAccountInput: { email, password, role } } });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-40">
      <Helmet>
        <title>Create Account | Yuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logo} className="w-52 mb-5 lg:mb-10" />
        <h4 className="w-full text-left font-medium text-lg lg:text-3xl">Let's get started</h4>
        <form className="grid gap-3 mt-5 w-full" onSubmit={handleSubmit(onCreateAccount)}>
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            className="input"
            placeholder="Email"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage="Please enter a valid email" />
          )}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
            className="input"
            placeholder="Password"
            type="password"
          />
          <input
            {...register("confirmPassword", {
              validate: (value: string) => value === watch("password") || "Passwords do not match",
            })}
            className="input"
            placeholder="Confirm Password"
            type="password"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 6 chars" />
          )}
          <select {...register("role", { required: "Role is required" })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button disable={!isValid} loading={loading} actionText="Create Account" />
          {result?.createAccount.error && <FormError errorMessage={result?.createAccount.error} />}
        </form>
        <div className="mt-5">
          Already have an account?{" "}
          <Link to="/" className="link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
