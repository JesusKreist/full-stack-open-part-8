import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import { EDIT_AUTHOR_OF_BOOK } from "../graphQL/mutations";

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState(null);
  const [born, setBorn] = useState("");
  const [updateAuthor] = useMutation(EDIT_AUTHOR_OF_BOOK);

  const availableAuthors = authors.map(({ name }) => ({
    value: name,
    label: name,
  }));

  const submit = (event) => {
    event.preventDefault();
    updateAuthor({ variables: { name, setBornTo: parseInt(born) } });
    setBorn("");
    setName(null);
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div style={{ width: "70%" }}>
          <Select
            onChange={({ value }) => setName(value)}
            options={availableAuthors}
          />
        </div>
        <div>
          born:{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirthYear;
