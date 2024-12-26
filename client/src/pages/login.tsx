import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "../__generated__/graphql";

interface ILoginForm {
  email: string;
  password: string;
}

export const LOGIN_MUTATION = gql(`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`);

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  const [loginMutation, { loading, data: loginResult }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data: LoginMutation) => {
      const { ok, token, error } = data.login;
      if (ok) {
        console.log(token);
      }
    },
  });

  const onLogin = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({ variables: { loginInput: { email, password } } });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg p-10 rounded-xl text-center shadow">
        <h3 className="text-3xl text-gray-800">Log In</h3>
        <form className="grid gap-3 mt-5 p-5" onSubmit={handleSubmit(onLogin)}>
          <input
            {...register("email", { required: "Email is required" })}
            className="input"
            placeholder="Email"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
            className="input"
            placeholder="Password"
            type="password"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 6 chars" />
          )}
          <button className="mt-3 button" disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </button>
          {loginResult?.login.error && <FormError errorMessage={loginResult?.login.error} />}
        </form>
      </div>
    </div>
  );
};
