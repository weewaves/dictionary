import React, { createContext } from "react";
import _ from "lodash";
import { search, prepareData } from "./SearchHelper";

export const SearchEngineContext = createContext();

class SearchEngineContextProvider extends React.Component {
  state = {
    dataLoaded: false,
    suggestions: {},
    definitions: {},
    searchedDefinitions: [],
    searchedSuggestions: []
  };

  constructor(props) {
    super(props);
    this.searchDebounce = _.debounce(this.onSearch, 100);
    this.suggestDebounce = _.debounce(this.onSuggest, 100);
  }

  async componentDidMount() {
    const response = await prepareData();

    this.setState({ dataLoaded: true });
    this.setState({ definitions: response.defData });
    this.setState({ suggestions: response.hwData });
  }

  componentWillUnmount() {
    this.searchDebounce.cancel();
    this.suggestDebounce.cancel();
  }

  doSuggest = (searchQuery, count) => {
    this.suggestDebounce(searchQuery, count);
  };

  doSearch = (searchQuery, count) => {
    this.searchDebounce(searchQuery, count);
  };

  onSearch(searchQuery, count) {
    if (!this.state.dataLoaded) {
      return;
    }

    search(this.state.definitions, searchQuery, count).then(results => {
      this.setState({ searchedDefinitions: results });
    });
  }

  onSuggest(searchQuery, count) {
    if (!this.state.dataLoaded) {
      return;
    }

    search(this.state.suggestions, searchQuery, count).then(results => {
      this.setState({ searchedSuggestions: results });
    });
  }

  render() {
    return (
      <SearchEngineContext.Provider
        value={{
          ...this.state,
          doSearch: this.doSearch,
          doSuggest: this.doSuggest
        }}
      >
        {this.props.children}
      </SearchEngineContext.Provider>
    );
  }
}

export default SearchEngineContextProvider;
