import React, { useContext, useState } from "react";
import { Definition } from "./Definition";
import { SearchBar } from "./SearchBar";
import Card from "@material-ui/core/Card";
import { SearchEngineContext } from "./SearchEngine";
import { v4 as uuid } from "uuid";

export const Search = () => {
  const searchEngineContext = useContext(SearchEngineContext);
  const [searchQuery] = useState("");

  return (
    <div id="dictionary">
      <Card className="card">
        <SearchBar searchQuery={searchQuery} />
        {searchEngineContext.searchedDefinitions.map(result => {
          return <Definition key={uuid()} data={result} />;
        })}
      </Card>
    </div>
  );
};
