import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "../__generated__/graphql";
import logo from "../images/uber-eats.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { isLoggedInVar, tokenVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

interface ILoginForm {
  email: string;
  password: string;
}

export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

export const LoginPage = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>();
  const [loginMutation, { loading, data: result }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data: LoginMutation) => {
      const { ok, token, error } = data.login;
      if (ok && token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, token);
        tokenVar(token);
        isLoggedInVar(true);
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
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-40">
      <Helmet>
        <title>Login | Yuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logo} className="w-52 mb-5 lg:mb-10" />
        <h4 className="w-full text-left font-medium text-lg lg:text-3xl">Weclom Back!</h4>
        <form className="grid gap-3 mt-5 w-full" onSubmit={handleSubmit(onLogin)}>
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
          <Button disable={!isValid} loading={loading} actionText="Log In" />
          {result?.login.error && <FormError errorMessage={result?.login.error} />}
        </form>
        <div className="mt-5">
          New to Yuber?{" "}
          <Link to="/create-account" className="link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
