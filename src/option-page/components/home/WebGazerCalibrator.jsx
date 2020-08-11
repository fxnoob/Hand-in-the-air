import React from 'react';
import webgazer from "../../../lib/webgazer/index";

export default class WebGazerCalibrator extends React.Component{

  componentDidMount() {
    this.init();
  }

  async init () {
    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    this.webgazer =
      await webgazer.setRegression('ridge')
      /* currently must set regression and tracker */
        .setGazeListener(function() {}).begin();
    webgazer.showPredictionPoints(true);
  }
  render () {
    return (
      <h1>WEBGAZER.JS</h1>
    );
  }
}
