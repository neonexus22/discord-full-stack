import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import RoutetLayout from "./layouts/root-layout";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <BrowserRouter>
          <RoutetLayout />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>
);
