import React from "react";
import "./styles.css";
import { Search } from "./Search";
import SearchEngineContextProvider from "./SearchEngine";

export default function App() {
  return (
    <div className="App">
      <SearchEngineContextProvider>
        <Search />
      </SearchEngineContextProvider>
    </div>
  );
}
