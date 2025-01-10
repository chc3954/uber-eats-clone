import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import App from "./App.tsx";
import { client } from "./apollo.ts";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ApolloProvider client={client}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ApolloProvider>
  // </StrictMode>
);
