// https://itnext.io/access-responsivevoice-js-in-react-app-without-a-package-a062b8d92950
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import "./TextToSpeechButton.css";

export function TextToSpeechButton(props) {
  function speak(event) {
    setTimeout(
      window.responsiveVoice.speak(props.textData, props.location),
      50
    );
  }

  return (
    <React.Fragment>
      <IconButton onClick={speak} className="speaker">
        <VolumeUpIcon />
      </IconButton>
    </React.Fragment>
  );
}
