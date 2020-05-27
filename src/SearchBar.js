import React, { useContext, useState, useEffect } from "react";
import { SearchEngineContext } from "./SearchEngine";
import "./SearchBar.css";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

function AutoComplete(props) {
  const searchEngineContext = useContext(SearchEngineContext);
  const [showPopup, setShowPopup] = useState(true);

  var currentFocus = -1;

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    setShowPopup(false);
  });

  useEffect(function() {
    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", onInput);
    searchInput.addEventListener("keydown", onKeydown);

    return function cleanup() {
      searchInput.removeEventListener("input", onInput);
      searchInput.removeEventListener("keydown", onKeydown);
    };
  });

  function onInput() {
    var val = this.value;

    setShowPopup(false);

    if (!val) {
      return false;
    }

    currentFocus = -1;
    setShowPopup(true);
  }

  function onKeydown(e) {
    var x = document.getElementById("autocomplete-popup");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  }

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) {
      currentFocus = 0;
    }

    if (currentFocus < 0) {
      currentFocus = x.length - 1;
    }

    if (x[currentFocus]) {
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function onSelect(event, dataItem, index) {
    props.onItemSelected(dataItem);
    setShowPopup(false);
  }

  return (
    <React.Fragment>
      <div id="autocomplete-popup" className="autocomplete-popup">
        {showPopup &&
          searchEngineContext.searchedSuggestions.map((item, index) => {
            const word = item.substring(1);

            return (
              <div
                key={index}
                onClick={event => {
                  onSelect(event, word, index);
                }}
              >
                <strong>{word}</strong>
                <input type="hidden" value={word} />
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
}

export const SearchBar = props => {
  const [searchStr, setSearchStr] = useState(props.searchQuery);
  const searchEngineContext = useContext(SearchEngineContext);

  function onSearchButtonClick(event) {
    event.persist();
    searchEngineContext.doSearch(searchStr);
  }

  function onSearchQueryChanged(value) {
    setSearchStr(value);
    searchEngineContext.doSuggest(value);
  }

  function onItemSelected(item) {
    setSearchStr(item);
  }

  return (
    <React.Fragment>
      <div className="searchBar">
        <div className="searchInputWrapper">
          <TextField
            id="searchInput"
            label="Tra từ"
            autoComplete="off"
            className="searchInput"
            margin="normal"
            variant="outlined"
            value={searchStr}
            onChange={event => {
              const value = event.target.value;
              onSearchQueryChanged(value);
              event.persist();
            }}
          />
          <AutoComplete
            onItemSelected={onItemSelected}
            data={searchEngineContext.searchedDefinitions}
          />
        </div>
        <IconButton
          className="searchButton"
          onClick={onSearchButtonClick}
          aria-label="search"
          color="inherit"
        >
          <SearchIcon />
        </IconButton>
      </div>
    </React.Fragment>
  );
};
