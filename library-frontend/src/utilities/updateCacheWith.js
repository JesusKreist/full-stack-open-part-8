import {
  BOOKS_BY_GENRE_OR_AUTHOR,
  GET_ALL_AUTHORS,
  GET_BOOK_TITLE_YEAR_AUTHOR,
} from "../graphQL/queries";

const updateCacheWith = ({ addedBook, client, user }) => {
  const isInCache = (cache, addedObject) =>
    cache.map((item) => item.id).includes(addedObject.id);

  const booksInCache = client.readQuery({
    query: GET_BOOK_TITLE_YEAR_AUTHOR,
  });

  if (!isInCache(booksInCache.allBooks, addedBook)) {
    try {
      client.writeQuery({
        query: GET_BOOK_TITLE_YEAR_AUTHOR,
        data: {
          ...booksInCache,
          allBooks: [...booksInCache.allBooks, addedBook],
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  const authorsInCache = client.readQuery({ query: GET_ALL_AUTHORS });

  if (!isInCache(authorsInCache.allAuthors, addedBook.author)) {
    try {
      client.writeQuery({
        query: GET_ALL_AUTHORS,
        data: {
          ...authorsInCache,
          allAuthors: [...authorsInCache.allAuthors, addedBook.author],
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  if (user && addedBook.genres.includes(user.favoriteGenre)) {
    const userRecommendationsInCache = client.readQuery({
      query: BOOKS_BY_GENRE_OR_AUTHOR,
      variables: { genre: user.favoriteGenre },
    });
    try {
      client.writeQuery({
        query: BOOKS_BY_GENRE_OR_AUTHOR,
        variables: { genre: user.favoriteGenre },
        data: {
          ...userRecommendationsInCache,
          allBooks: [...userRecommendationsInCache.allBooks, addedBook],
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  }
};

export default updateCacheWith;
