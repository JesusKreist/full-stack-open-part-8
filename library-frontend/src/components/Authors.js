import React from "react";
import { GET_ALL_AUTHORS } from "../graphQL/queries";
import { useQuery } from "@apollo/client";
import SetBirthYear from "./SetBirthYear";

const Authors = ({ show }) => {
  const authors = useQuery(GET_ALL_AUTHORS);

  if (!show) {
    return null;
  }

  if (authors.loading) {
    return <div>loading... please wait.</div>;
  }

  const { allAuthors } = authors.data;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={allAuthors} />
    </div>
  );
};

export default Authors;
