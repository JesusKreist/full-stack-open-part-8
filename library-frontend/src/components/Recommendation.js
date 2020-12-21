import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { BOOKS_BY_GENRE_OR_AUTHOR } from "../graphQL/queries";

const Recommendation = ({ show, user }) => {
  const [recommendBooks, recommendBooksResult] = useLazyQuery(
    BOOKS_BY_GENRE_OR_AUTHOR
  );

  useEffect(() => {
    if (user && user.favoriteGenre) {
      recommendBooks({ variables: { genre: user.favoriteGenre } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!show || !user || !user.favoriteGenre) {
    return null;
  }

  if (recommendBooksResult.data) {
    const { allBooks } = recommendBooksResult.data;
    return (
      <div>
        <h2>These are your recommendations</h2>
        <p>
          Books in your favorite genre <b>{user.favoriteGenre}</b>
        </p>
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
      </div>
    );
  }

  return null;
};

export default Recommendation;
