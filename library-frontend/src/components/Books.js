import React, { useState, useEffect } from "react";
import {
  GET_BOOK_TITLE_YEAR_AUTHOR,
  BOOKS_BY_GENRE_OR_AUTHOR,
} from "../graphQL/queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

const Books = ({ show }) => {
  const books = useQuery(GET_BOOK_TITLE_YEAR_AUTHOR);
  const [showBookByGenre, setShowBookByGenre] = useState(false);
  const [userGenre, setUserGenre] = useState(null);
  const [filterByGenre, filterByGenreResult] = useLazyQuery(
    BOOKS_BY_GENRE_OR_AUTHOR
  );
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (filterByGenreResult.data) {
      setFilteredBooks(filterByGenreResult.data.allBooks);
    }
  }, [filterByGenreResult.data]);

  if (!show) {
    return null;
  }

  if (books.loading) {
    return <div>loading... please wait.</div>;
  }

  const { allBooks } = books.data;

  const allGenres = allBooks.reduce((accumulator, currentValue) => {
    return [...accumulator, ...currentValue.genres];
  }, []);

  const booksByGenre = (genre) => {
    filterByGenre({ variables: { genre } });
  };

  const uniqueGenres = _.uniq(allGenres);

  if (showBookByGenre && userGenre !== null) {
    return (
      <div>
        Genre: {userGenre}
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            setFilteredBooks([]);
            setShowBookByGenre(false);
          }}
        >
          All Books
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>books</h2>
      {!showBookByGenre && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {uniqueGenres.map((genre) => (
        <button
          key={uuidv4()}
          onClick={() => {
            booksByGenre(genre);
            setUserGenre(genre);
            setShowBookByGenre(true);
          }}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
