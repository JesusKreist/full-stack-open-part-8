import React, { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import { useToasts } from "react-toast-notifications";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";
import { NEWLY_ADDED_BOOK } from "./graphQL/subscriptions";
import updateCacheWith from "./utilities/updateCacheWith";

const App = () => {
  const [page, setPage] = useState("authors");
  // eslint-disable-next-line no-unused-vars
  const client = useApolloClient();
  const { addToast } = useToasts();
  const [user, setUser] = useState(null);

  useSubscription(NEWLY_ADDED_BOOK, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateCacheWith({
        addedBook: subscriptionData.data.bookAdded,
        client,
        user,
      });
    },
  });

  const logout = () => {
    client.resetStore();
    setPage("authors");
    setUser(null);
    localStorage.clear();
  };

  const notify = (message, appearance) => {
    addToast(message, { appearance, autoDismiss: true });
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {user && <button onClick={() => setPage("add")}>add book</button>}
        {user ? (
          <>
            <button onClick={logout}>logout</button>
            <button onClick={() => setPage("recommendation")}>
              recommendations
            </button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} user={user} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} user={user} notify={notify} />
      <LoginForm show={page === "login"} setUser={setUser} setPage={setPage} />
      <Recommendation show={page === "recommendation"} user={user} />
    </div>
  );
};

export default App;
