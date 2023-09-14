import { useState, useEffect } from "react";

const KEY = "2d1e77c8";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    const controller = new AbortController();

    async function fetchMovies() {

      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (res.status !== 200) throw new Error("Something went wrong");

        const data = await res.json();

        if (data.Search === undefined) throw new Error("Movie not found");
        setMovies(data.Search)
        setError("");

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false)
      }
      // Because this effect will be executed on initial mount.. and the query length will be 0.
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // nullSelectedId();
    fetchMovies();

    return function () {
      controller.abort();
    }
  },
    [query])

  return { movies, isLoading, error };
}