import { gql } from "@apollo/client";

export const NEWLY_ADDED_BOOK = gql`
  subscription subscriptionBookAdded {
    bookAdded {
      title
      published
      author {
        name
        born
        id
        bookCount
      }
      id
      genres
    }
  }
`;
