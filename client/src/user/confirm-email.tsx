import { useEffect } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../__generated__/graphql";
import { useMe } from "../hooks/useMe";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`;

export const ConfirmEmailPage = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { data: userData } = useMe();
  const [verifyEmail] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted: (data: VerifyEmailMutation) => {
        const { ok } = data.verifyEmail;
        if (ok) {
          client.writeFragment({
            id: `User:${userData?.me.id}`,
            fragment: gql`
              fragment VerifiedUser on User {
                verified
              }
            `,
            data: {
              verified: true,
            },
          });
        }
        navigate("/");
      },
    }
  );

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Yuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">Please wait, don't close this page</h4>
    </div>
  );
};
