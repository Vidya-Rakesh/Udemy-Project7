//A customHook to handle the localstoragestates

import { useState, useEffect } from "react";
export function useLocalStorageState(initialState, key) {
  /*State to handle watched movies. it's written in another way by passing a function
   to store the values in the local storage*/
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue
      ? JSON.parse(storedValue)
      : initialState; /*convert back the string to original type */
  }); /*State to handle watched movies &
   a pure function which returns value stored in localstorage 
   is passed as initial value of state.*/

  //Effect to handle storing movies added to watched list to the localstorage.
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value]
  );

  return [value, setValue];
}
