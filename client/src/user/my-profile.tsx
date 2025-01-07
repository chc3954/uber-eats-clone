import { useMe } from "../hooks/useMe";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { EditProfileMutation, EditProfileMutationVariables } from "../__generated__/graphql";
import { Helmet } from "react-helmet-async";

interface IMyProfileForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

export const MyProfilePage = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IMyProfileForm>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const [editProfile, { loading }] = useMutation<EditProfileMutation, EditProfileMutationVariables>(
    EDIT_PROFILE_MUTATION,
    {
      onCompleted: (data: EditProfileMutation) => {
        const { ok } = data.editProfile;
        if (ok && userData) {
          const { email: oldEmail, id } = userData.me;
          const { email: newEmail } = getValues();

          if (oldEmail !== newEmail) {
            client.writeFragment({
              id: `User:${id}`,
              fragment: gql`
                fragment EditUser on User {
                  verified
                  email
                }
              `,
              data: {
                verified: false,
                email: newEmail,
              },
            });
          }
        }
      },
    }
  );

  const onUpdate = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        editProfileInput: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Profile | Yuber Eats</title>
      </Helmet>
      <h4 className="mb-3 font-semibold text-2xl">My Profile</h4>
      <form className="grid max-w-screen-sm gap-3 mt-5 w-full" onSubmit={handleSubmit(onUpdate)}>
        <input
          {...register("email", {
            value: watch("email"),
            required: "Email is required",
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
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
        <Button disable={!isValid} loading={loading} actionText="Update" />
        {/* {result?.login.error && <FormError errorMessage={result?.login.error} />} */}
      </form>
    </div>
  );
};
