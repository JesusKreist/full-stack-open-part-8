import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { LOGIN } from "../graphQL/mutations";
import { WhoAmI } from "../graphQL/queries";

const LoginForm = ({ show, setUser, setPage }) => {
  const [username, setUsername] = useState("JesusKreist");
  const [password, setPassword] = useState("password");
  const [loginUser, loginResult] = useMutation(LOGIN, {
    onError: (error) => console.log({ ...error }),
  });
  const [getUser, getUserResult] = useLazyQuery(WhoAmI);

  useEffect(() => {
    if (loginResult.data) {
      const authToken = loginResult.data.login.value;
      localStorage.setItem("mygraphql-app-user", authToken);
      setUsername("");
      setPassword("");
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginResult.data]);

  useEffect(() => {
    if (getUserResult.data) {
      const loggedInUser = getUserResult.data.me;
      setUser(loggedInUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserResult.data]);

  if (!show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    loginUser({ variables: { username, password } });
    setPage("recommendation");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username:{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:{" "}
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
