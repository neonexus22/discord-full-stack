import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { InMemoryCache } from "@apollo/client/cache";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { ApolloClient } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

loadDevMessages();
loadErrorMessages();

const getToken = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const authLink = setContext(async (_, { headers }) => {
  const token = getToken("__session");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// TODO: websocket link

const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );
    });

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(uploadLink),
  cache,
});

export default client;
