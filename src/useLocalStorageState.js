import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const data = localStorage.getItem(key);
    if (data)
      return JSON.parse(data);

    return initialState;
  });


  useEffect(function () {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}