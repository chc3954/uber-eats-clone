import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  return (
    <>
      <div>LoggedInRouter</div>
      <button onClick={() => isLoggedInVar(false)}>Log Out</button>
    </>
  );
};
