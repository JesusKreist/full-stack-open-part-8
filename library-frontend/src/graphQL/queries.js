import { gql } from "@apollo/client";

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const GET_BOOK_TITLE_YEAR_AUTHOR = gql`
  query {
    allBooks {
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

export const BOOKS_BY_GENRE_OR_AUTHOR = gql`
  query filterGreen($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
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

export const WhoAmI = gql`
  query whoAmI {
    me {
      username
      favoriteGenre
      id
    }
  }
`;
