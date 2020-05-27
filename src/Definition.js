import React from "react";
import Divider from "@material-ui/core/Divider";
import { v4 as uuid } from "uuid";
import { TextToSpeechButton } from "./TextToSpeechButton";
import "./Definition.css";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Definition = props => {
  const definitionLines = props.data.split(/\r?\n/);

  function getTemplate(data) {
    switch (data.charAt(0)) {
      case "@":
        const word = data
          .split("/")[0]
          .trim()
          .substring(1);
        const phonetic = data.substring(1).replace(word, "");
        return (
          <div className="headword" key={uuid()}>
            <p className="word-search-key">{capitalize(word)}</p>
            <span className="phon">{phonetic}</span>
            <div className="sound">
              <TextToSpeechButton
                textData={word}
                location={"US English Female"}
              />
              <span>us</span>
              <TextToSpeechButton
                textData={word}
                location={"UK English Female"}
              />
              <span>uk</span>
            </div>
            <div className="clear" />
          </div>
        );
      case "*":
        return (
          <div key={uuid()}>
            <p className="word-type">{capitalize(data.substring(1).trim())}</p>
            <div className="clear" />
          </div>
        );
      case "!":
      case "-":
        return (
          <div key={uuid()} className="word-meaning">
            <p>{capitalize(data.substring(1).trim())}</p>
          </div>
        );
      case "=":
        const vMeaning = capitalize(
          data
            .split("+")[0]
            .substring(1)
            .trim()
        );
        const eMeaning = capitalize(
          data
            .split("+")[1]
            .substring(1)
            .trim()
        );
        return (
          <div key={uuid()} className="word-sentence">
            <p>
              <i>{vMeaning}</i>
            </p>
            <p>
              <i>{eMeaning}</i>
            </p>
          </div>
        );
      default:
        return data;
    }
  }

  return (
    <React.Fragment>
      <article>
        {definitionLines.map(line => {
          return getTemplate(line);
        })}
      </article>
      <Divider variant="middle" />
    </React.Fragment>
  );
};
