import { useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { CREATE_BOOK } from "../graphQL/mutations";
import updateCacheWith from "../utilities/updateCacheWith";

const NewBook = ({ show, user, notify }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const client = useApolloClient();

  const [createNewBook] = useMutation(CREATE_BOOK);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    createNewBook({
      variables: { title, author, published: parseInt(published), genres },
      update: (_, response) => {
        const addedBook = response.data.addBook;
        notify(`${addedBook.title} was added!`, "success");
        updateCacheWith({
          addedBook,
          client,
          user,
        });
      },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
        </div>
        <div>
          <input
            type="text"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
