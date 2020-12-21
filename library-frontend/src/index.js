import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";
import { ToastProvider } from "react-toast-notifications";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const authLink = setContext((request, { headers }) => {
  const token = localStorage.getItem("mygraphql-app-user");
  // const token =

  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikplc3VzS3JlaXN0IiwiaWQiOiI1ZmQ1ZjU4NjhiZDVmMGYwNmVlYzRhYzAiLCJpYXQiOjE2MDgyOTYxNTJ9.cOhLY-ZLmYM-pcVIK0IjMCnbbIZvCX86oafder9i8wc";
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = new HttpLink({ uri: "http://localhost:4000/" });

const wsLink = new WebSocketLink({
  // eslint-disable-next-line quotes
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const determineLinkWithQuery = (query) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
};

const splitLink = split(
  ({ query }) => determineLinkWithQuery(query),
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
