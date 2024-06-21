//A customHook to handle all the code related to fetching movie details and displaying movie in it.

import { useState, useEffect } from "react";

const KEY = "b12b0c4b"; /*We got it from omdb site API Keys*/
//export function useMovies(query, callback) {callback fn is removed as react complaints abt dependencies
export function useMovies(query) {
  const [movies, setMovies] = useState([]); //state to handle display movies in MovieList

  /*State to represent loading... when it takes time for loading*/
  const [isLoading, setIsLoading] = useState(false);

  /*State to represent the error*/
  const [error, setError] = useState("");
  /*useEffect function to handle side effects and to fetch and display contents based on dependency arrays*/
  useEffect(
    function () {
      // callback?.(); //Calls the callback fn only if it exists as we use optional chaining ?.

      const controller = new AbortController(); //browser API to handle race condition

      async function fetchMovies() {
        try {
          setIsLoading(
            true
          ); /*Initially set true to show that data is loading*/
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(
            false
          ); /*Have to change to false even the error occurs or data being fetched*/
        }
      }
      /*checking whether the search query has atleast 3 characters,if not returns immediately*/
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //handleCloseMovie(); this fn to close the movie can't be called here as it is not defined here but in App comp. So we have to pass a callback fn to our customHook
      fetchMovies();

      //Clean up Function
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
